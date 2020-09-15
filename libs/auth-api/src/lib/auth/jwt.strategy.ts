import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { passportJwtSecret } from 'jwks-rsa'
import { ConfigService } from '@nestjs/config'
import { config } from './auth-config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        cacheMaxEntries: 5, // Default value
        // cacheMaxAge: ms('10m'), // Default value
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('IDS_JWKS_URI')
        }),
      
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.idsAudience,
      issuer: configService.get<string>('IDS_ISSUER'),
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return payload
  }
}