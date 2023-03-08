import { SecretCallback } from 'express-jwt'
import { decode } from 'jsonwebtoken'
import { ExpressJwtOptions, JwksClient } from 'jwks-rsa'

interface MultiIssuerOptions extends Omit<ExpressJwtOptions, 'jwksUri'> {
  jwksUri: string[]
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
export const multiIssuerKeyProvider = ({
  jwksUri,
  ...options
}: MultiIssuerOptions): SecretCallback => {
  if (!jwksUri) {
    throw new Error('jwksUri is required')
  }

  const clients = new Map<string, JwksClient>()
  jwksUri.map((uri) => {
    clients.set(uri, new JwksClient({ jwksUri: uri, ...options }))
  })
  const onError = options.handleSigningKeyError || handleSigningKeyError
  // (req: express.Request, payload: any, done: (err: any, secret?: secretType) => void): void;
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

    const client = clients.get(decodedJwtToken.iss)

    if (!client) {
      return callback(
        new Error(`Issuer ${decodedJwtToken.iss} is not configured`),
      )
    }

    client.getSigningKey(decodedJwtToken.header.kid, (error, key) => {
      if (error) {
        return onError(error, (newError) => callback(newError))
      }

      return callback(null, key.getPublicKey())
    })
  }
}
