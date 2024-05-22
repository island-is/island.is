import jwksRsa from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { authModuleConfig } from '../app/app.config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authModuleConfig.KEY)
    config: ConfigType<typeof authModuleConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `${config.issuer}/.well-known/openid-configuration/jwks`,
      }),
      audience: config.clientId,
      issuer: config.issuer,
      algorithms: ['RS256'],
    })
  }

  async validate(payload: unknown) {
    console.log(`Validating payload: ${JSON.stringify(payload)}`)
    return {
      nationalId: (payload as { nationalId?: string }).nationalId ?? '',
    }
  }
}
