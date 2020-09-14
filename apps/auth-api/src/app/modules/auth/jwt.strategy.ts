import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { passportJwtSecret } from 'jwks-rsa'
import { environment } from '../../../environments'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5, // Default value
        // cacheMaxAge: ms('10m'), // Default value
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: environment.IDS_JWKS_URI
        }),
      
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: environment.IDS_AUDIENCE,
      issuer: environment.IDS_ISSUER,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
      return payload
  }
}