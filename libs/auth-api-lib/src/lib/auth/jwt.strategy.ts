import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { passportJwtSecret } from 'jwks-rsa'
import { Config } from './auth.module'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: Config) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: config.jwksUri,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.audience,
      issuer: config.issuer,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    })
  }

  async validate(payload: unknown) {
    return payload
  }
}
