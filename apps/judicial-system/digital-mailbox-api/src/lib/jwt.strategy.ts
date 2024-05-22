import jwksRsa from 'jwks-rsa'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { digitalMailboxModuleConfig } from '../app/app.config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(digitalMailboxModuleConfig.KEY)
    config: ConfigType<typeof digitalMailboxModuleConfig>,
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

  async validate(payload: { nationalId: string }) {
    return {
      user: payload?.nationalId, //TODO: create type?
    }
  }
}
