import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

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
        jwksUri: 'http://localhost:6000/.well-known/openid-configuration/jwks' // TODO: Use process.env.IDS_JWKS_URI ?
        }),
      
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.IDS_AUDIENCE,
      issuer: process.env.IDS_ISSUER,
      algorithms: ['RS256'],
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
      return payload;
  }
}