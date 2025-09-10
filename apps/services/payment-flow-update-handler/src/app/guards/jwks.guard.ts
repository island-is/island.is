import {
  Injectable,
  type ExecutionContext,
  CanActivate,
  Inject,
} from '@nestjs/common'
import { JwksClient } from 'jwks-rsa'
import jwt, { type SigningKeyCallback, type JwtHeader } from 'jsonwebtoken'

import type { ConfigType } from '@nestjs/config'
import { AppConfig } from '../app.config'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

export const JwksClientProvider = {
  provide: JwksClient,
  useFactory: (config: ConfigType<typeof AppConfig>) => {
    const issuer = config.paymentsWebUrl
    return new JwksClient({
      jwksUri: `${issuer}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    })
  },
  inject: [AppConfig.KEY],
}

const extractPublicKeyFromJwtHeader =
  (jwksClient: JwksClient) =>
  (header: JwtHeader, callback: SigningKeyCallback) => {
    jwksClient.getSigningKey(header.kid, (error, key) => {
      if (error || !key) {
        return callback(error || new Error('No signing key found'))
      }
      callback(null, key.getPublicKey())
    })
  }

@Injectable()
export class JwksGuard implements CanActivate {
  constructor(
    private readonly jwksClient: JwksClient,
    @Inject(AppConfig.KEY)
    private readonly config: ConfigType<typeof AppConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private validateIncomingJwt(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        extractPublicKeyFromJwtHeader(this.jwksClient),
        {
          algorithms: ['RS256'],
          issuer: this.config.paymentsWebUrl,
          audience: this.config.paymentFlowUpdateHandlerApiUrl,
        },
        (error, decoded) => {
          if (error) {
            return reject(error)
          }
          if (typeof decoded === 'string' || !decoded?.jti) {
            return reject(new Error('Missing jti'))
          }
          resolve(decoded)
        },
      )
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader: string = request.headers.authorization

    if (!authHeader) {
      return false
    }

    const [type, token] = authHeader.split(' ')
    if (type.toLowerCase() !== 'bearer') {
      return false
    }

    try {
      await this.validateIncomingJwt(token)
    } catch (error) {
      this.logger.warn('JWT validation error', {
        error,
      })
      return false
    }

    return true
  }
}
