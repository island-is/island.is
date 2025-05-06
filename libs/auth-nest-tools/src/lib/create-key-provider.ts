import { decode } from 'jsonwebtoken'
import {
  ExpressJwtOptions,
  JwksClient,
  passportJwtSecret,
  SecretCallback,
} from 'jwks-rsa'

import { logger } from '@island.is/logging'

const JWKS_URI = '/.well-known/openid-configuration/jwks'
const keyProviderBaseOptions = {
  cache: true,
  rateLimit: true,
}

export const createKeyProvider = (issuer: string | string[]) => {
  issuer = Array.isArray(issuer) ? issuer : [issuer]

  if (issuer.length === 0) {
    throw new Error('No issuer provided')
  }

  if (issuer.length > 1) {
    // Creates a key provider for each given issuer
    return createMultiIssuerKeyProvider({
      ...keyProviderBaseOptions,
      issuers: issuer,
    })
  }

  // Creates key provider for a single issuer with default jwks-rsa method
  return passportJwtSecret({
    ...keyProviderBaseOptions,
    jwksUri: `${issuer[0]}${JWKS_URI}`,
  })
}

interface MultiIssuerOptions extends Omit<ExpressJwtOptions, 'jwksUri'> {
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
  issuers,
  ...options
}: MultiIssuerOptions): SecretCallback => {
  const clients = new Map<string, JwksClient>()
  for (const issuer of issuers) {
    clients.set(
      issuer,
      new JwksClient({ jwksUri: `${issuer}${JWKS_URI}`, ...options }),
    )
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

    const payload = decodedJwtToken.payload
    if (typeof payload === 'string') {
      throw new Error(
        "Token payload is a plain string, don't know what to do 🤷",
      )
    }
    if (payload.iss === undefined) {
      throw new Error('Issuer field is undefined 😠')
    }

    const issuer = payload.iss
    const client = clients.get(issuer)

    if (!client) {
      logger.warn(new Error(`Unsupported issuer: ${issuer}`))
      return callback(null)
    }

    client
      .getSigningKey(decodedJwtToken.header.kid)
      .then((key) => {
        callback(null, key.getPublicKey())
      })
      .catch((error) => {
        onError(error, (newError) => callback(newError))
      })
  }
}
