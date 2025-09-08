import {
  Injectable,
  type ExecutionContext,
  CanActivate,
  Inject,
} from '@nestjs/common'
import { JwksClient } from 'jwks-rsa'
import jwt, { type SigningKeyCallback, type JwtHeader } from 'jsonwebtoken'
import crypto from 'crypto'

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
      cacheMaxEntries: 5,
      cacheMaxAge: 10 * 60 * 1000, // 10 minutes
    })
  },
  inject: [AppConfig.KEY],
}

const computeSha256 = (body: string): string => {
  return crypto.createHash('sha256').update(body).digest('hex')
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

  private extractPublicKeyFromJwtHeader(
    header: JwtHeader,
    callback: SigningKeyCallback,
  ) {
    this.jwksClient.getSigningKey(header.kid, (error, key) => {
      if (error || !key) {
        return callback(error)
      }
      callback(null, key.getPublicKey())
    })
  }

  private validateIncomingJwt(token: string, rawBody: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        this.extractPublicKeyFromJwtHeader,
        {
          algorithms: ['RS256'],
          issuer: this.config.paymentsWebUrl,
          audience: this.config.paymentFlowUpdateHandlerApiUrl,
        },
        (error, decoded) => {
          if (error) return reject(error)
          if (typeof decoded === 'string' || !decoded?.jti) {
            return reject(new Error('Missing jti'))
          }

          resolve(decoded)

          // TODO: Implement replay attack and payload hash validation

          // jtiCache
          //   .isReplay(decoded.jti)
          //   .then((isReplayAttack) => {
          //     if (isReplayAttack) {
          //       return reject(new Error('Replay attack detected'))
          //     }

          //     const actualHash = computeSha256(rawBody)
          //     if (
          //       !decoded.payload_hash ||
          //       decoded.payload_hash !== actualHash
          //     ) {
          //       return reject(new Error('Payload hash mismatch'))
          //     }
          //     resolve(decoded)
          //   })
          //   .catch((error) => {
          //     reject(error)
          //   })
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

    const rawBody = request.rawBody.toString('utf8')

    try {
      // await this.validateIncomingJwt(token, rawBody)
    } catch (error) {
      this.logger.warn('JWT validation error', {
        error,
      })
      return false
    }

    return true
  }
}
