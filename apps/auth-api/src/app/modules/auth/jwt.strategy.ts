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
        jwksUri: 'http://localhost:6002/.well-known/openid-configuration/jwks'
        }),
      
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: '@identityserver.api',
      issuer: 'https://localhost:6001',
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
      return payload;
  }
}