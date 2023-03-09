import { SecretCallback } from 'express-jwt'
import { decode } from 'jsonwebtoken'
import { ExpressJwtOptions, JwksClient, passportJwtSecret } from 'jwks-rsa'
import JwksRsa = require('jwks-rsa')

import { logger } from '@island.is/logging'

const JWKS_URI = '/.well-known/openid-configuration/jwks'
const keyProviderBaseOptions = {
  cache: true,
  rateLimit: true,
}

export const createKeyProvider = (issuer: string | string[]) => {
  if (Array.isArray(issuer)) {
    // Creates a key provider for each given issuer
    return createMultiIssuerKeyProvider({
      ...keyProviderBaseOptions,
      jwksUri: '/.well-known/openid-configuration/jwks',
      issuers: issuer,
    })
  }

  // Creates key provider for a single issuer with default jwks-rsa method
  return passportJwtSecret({
    ...keyProviderBaseOptions,
    jwksUri: `${issuer}${JWKS_URI}`,
  })
}

interface MultiIssuerOptions extends Omit<ExpressJwtOptions, 'jwksUri'> {
  // Path to the JWKS on the issuer
  jwksUri: string

  // Array of issuer URLs
  issuers: string[]
}

// Copied from jwks-rsa/lib/integrations/passport.js
const handleSigningKeyError = (
  error: Error,
  callback: (error: Error | null) => void,
) => {
  // If we didn't find a match, can't provide a key.
  if (error && error.name === 'SigningKeyNotFoundError') {
    return callback(null)
  }

  // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
  if (error) {
    return callback(error)
  }
}

/**
 * This function is an extension of the passportJwtSecret function from jwks-rsa.
 * It allows you to specify multiple issuers and will return the correct key for the issuer.
 */
const createMultiIssuerKeyProvider = ({
  jwksUri,
  issuers,
  ...options
}: MultiIssuerOptions): SecretCallback => {
  if (!jwksUri || !issuers || issuers.length === 0) {
    throw new Error('jwksUri and issuers is required')
  }

  const clients = new Map<string, JwksClient>()
  for (const issuer of issuers) {
    clients.set(issuer, JwksRsa({ jwksUri: `${issuer}${jwksUri}`, ...options }))
  }

  const onError = options.handleSigningKeyError || handleSigningKeyError

  return (request, rawJwtToken, callback) => {
    const decodedJwtToken = decode(rawJwtToken, { complete: true })

    // Only RS256 is supported.
    if (
      !decodedJwtToken ||
      !decodedJwtToken.header ||
      decodedJwtToken.header.alg !== 'RS256'
    ) {
      return callback(null)
    }

    const issuer = decodedJwtToken.payload.iss
    const client = clients.get(issuer)

    if (!client) {
      logger.warn(new Error(`Unsupported issuer: ${issuer}`))
      return callback(null)
    }

    client.getSigningKey(decodedJwtToken.header.kid, (error, key) => {
      if (error) {
        return onError(error, (newError) => callback(newError))
      }

      return callback(null, key.getPublicKey())
    })
  }
}
