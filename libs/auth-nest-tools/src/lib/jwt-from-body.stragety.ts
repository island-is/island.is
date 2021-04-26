import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common'
import { JwtPayload } from './jwt.payload'
import { User } from './user'
import { AuthConfig } from './auth.module'
import { passportJwtSecret } from 'jwks-rsa'

@Injectable()
export class JwtFromBodyStrategy extends PassportStrategy(
  Strategy,
  'FromBody',
) {
  constructor(private config: AuthConfig) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: config.jwksUri,
      }),

      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      audience: config.audience,
      issuer: config.issuer,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    return {
      nationalId: payload.nationalId ?? payload.natreg,
      scope: payload.scope,
      authorization: '',
    }
  }
}
