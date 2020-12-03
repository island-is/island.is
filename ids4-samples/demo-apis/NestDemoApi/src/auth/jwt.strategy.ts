import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { passportJwtSecret } from 'jwks-rsa'
import { JwtPayload } from './jwt.payload'
import { User } from './user'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: process.env.JWKS_URI,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    return {
      nationalId: payload.nationalId ?? payload.natreg,
      scope: payload.scope,
    }
  }
}
