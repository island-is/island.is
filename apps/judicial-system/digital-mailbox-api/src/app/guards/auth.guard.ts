import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigType } from '@island.is/nest/config'

import { authModuleConfig } from '../app.config'

@Injectable()
export class AuthGuard implements CanActivate {
  private secretClient

  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
  ) {
    this.secretClient = jwksClient({
      cache: true,
      rateLimit: true,
      jwksUri: `${this.config.issuer}/.well-known/openid-configuration/jwks`,
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authToken = request.headers['authorization']

    if (!authToken) {
      this.logger.debug('No authorization header found')
      throw new UnauthorizedException('No authorization token found')
    }

    const token = authToken.split(' ')[1]

    try {
      const verifiedUserToken = await this.verifyIdsToken(token)

      if (!verifiedUserToken.sub) {
        throw new UnauthorizedException('Invalid token')
      }

      request.user = verifiedUserToken
      return true
    } catch (error) {
      this.logger.debug('Invalid token')
      throw new UnauthorizedException('Invalid token')
    }
  }

  private async verifyIdsToken(token: string) {
    try {
      const decodedToken = jwt.decode(token, { complete: true })
      const tokenHeader = decodedToken?.header

      if (!tokenHeader) {
        throw new Error('Invalid access token header')
      }

      const signingKeys = await this.secretClient.getSigningKeys()
      const matchingKey = signingKeys.find((sk) => sk.kid === tokenHeader.kid)

      if (!matchingKey) {
        throw new Error(`No matching key found for kid ${tokenHeader.kid}`)
      }

      const publicKey = matchingKey.getPublicKey()

      const verifiedToken = jwt.verify(token, publicKey, {
        issuer: this.config.issuer,
        clockTimestamp: Date.now() / 1000,
        ignoreNotBefore: false,
        audience: this.config.clientId,
      })

      return verifiedToken as {
        sub: string
      }
    } catch (error) {
      this.logger.error('Token verification failed:', error)
      throw new UnauthorizedException('Token verification failed')
    }
  }
}
