import { logger } from '@island.is/logging'
import * as express from 'express'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { error } from './utils'

const secretClient = jwksClient({
  cache: true,
  rateLimit: true,
  jwksUri: 'https://token.actions.githubusercontent.com/.well-known/jwks',
})

export const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (process.env.DISABLE_AUTH === 'true') {
    return next()
  }
  try {
    const signingKeys = await secretClient.getSigningKeysAsync()
    const auth = req.header('Authorization')
    if (!auth) {
      logger.info(req.method, req.path)
      logger.info('headers:', req.headers)
      return error(res, 'Missing Authorization', 401)
    }
    const [type, token] = auth.split(' ')
    if (type.toLowerCase() !== 'bearer') {
      return error(res, 'Only bearer token allowed', 401)
    }
    logger.debug('jwtToken', jwt.decode(token))
    const successKey = signingKeys.find((sk) => {
      try {
        const publicKey = sk.getPublicKey()
        jwt.verify(token, publicKey)
        return publicKey
      } catch (e) {
        logger.debug('Could not verify', e)
        return null
      }
    })
    logger.debug(`successKey`, successKey)
    if (successKey) {
      logger.debug(`Successful verification using`, successKey)
      next()
    } else {
      return error(res, 'Unauthorized', 401)
    }
  } catch (e) {
    next(e)
  }
}
