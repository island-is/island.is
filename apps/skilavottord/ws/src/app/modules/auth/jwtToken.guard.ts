import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import type { GraphQLContext } from '@island.is/auth-nest-tools'
import { getRequest } from '@island.is/auth-nest-tools'

import { logger } from '@island.is/logging'
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const secretClient = jwksClient({
  cache: true,
  rateLimit: true,
  jwksUri:
    'https://identity-server.dev01.devland.is/.well-known/openid-configuration/jwks',
})

@Injectable()
export class JWTTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: GraphQLContext['req'] = getRequest(context)

    const signingKeys = await secretClient.getSigningKeys()
    const auth = request.header('Authorization')

    if (!auth) {
      logger.info(request.method, request.path)
      logger.info('headers:', request.headers)
      //return error(res, 'Missing Authorization', 401)
    }
    const [type, token] = auth.split(' ')
    if (type.toLowerCase() !== 'bearer') {
      logger.error(`'Only bearer token allowed'`, 401)
      // return error(res, 'Only bearer token allowed', 401)
    }
    try {
      const jwtToken = jwt.decode(token)
      logger.debug('jwtToken', jwtToken)
      logger.info('nationalId', jwtToken['nationalId'])
    } catch (e) {
      logger.warn(`Error decoding token ${token}`, e)
    }

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

    if (successKey) {
      logger.debug(`Successful verification using`, successKey)
      return true
    } else {
      logger.error(`Error verification using`, successKey)
      return false
    }
  }
}
