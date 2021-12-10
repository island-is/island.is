import { Injectable, Inject } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/air-discount-scheme/consts'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { environment } from '../../../environments'
import { Credentials } from './auth.types'
const AUTH_BODY_FIELD_NAME = '__accessToken'

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies[ACCESS_TOKEN_COOKIE_NAME]
  }
  return null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {
    super({
      //jwtFromRequest: cookieExtractor,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromBodyField(AUTH_BODY_FIELD_NAME),
      ]),
      secretOrKey: environment.auth.jwtSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, { csrfToken, user }: Credentials) {
    if (csrfToken && `Bearer ${csrfToken}` !== req.headers['authorization']) {
      this.logger.error('invalid csrf token')
      return null
    }

    return user
  }
}
