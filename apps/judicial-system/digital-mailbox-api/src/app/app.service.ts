import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { AuditTrailService } from '@island.is/judicial-system/audit-trail'

import { authModuleConfig } from './app.config'

@Injectable()
export class AppService {
  constructor(
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly auditTrailService: AuditTrailService,
  ) {}

  private async test(): Promise<string> {
    return 'OK'
  }

  async testConnection(token: string): Promise<string> {
    //TODO: Audit
    const verifiedUserToken = await this.verifyIdsToken(token)

    if (!verifiedUserToken.sub) {
      throw new UnauthorizedException('Invalid token')
    }

    return this.test()
  }

  async verifyIdsToken(token: string) {
    try {
      const secretClient = jwksClient({
        cache: true,
        rateLimit: true,
        jwksUri: `${this.config.issuer}/.well-known/openid-configuration/jwks`,
      })

      const decodedToken = jwt.decode(token, { complete: true })
      const tokenHeader = decodedToken?.header

      if (!tokenHeader) {
        throw new Error('Invalid access token header')
      }

      const signingKeys = await secretClient.getSigningKeys()
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
      console.error('Token verification failed:', error)
      throw error
    }
  }
}
