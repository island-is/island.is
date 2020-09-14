import { Strategy } from 'passport-jwt'

import { Injectable, Inject } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'

import { environment } from '../../../environments'
import { Credentials } from './auth.types'

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
      jwtFromRequest: cookieExtractor,
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
