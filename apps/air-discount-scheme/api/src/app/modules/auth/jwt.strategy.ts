import { Injectable, Inject } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { environment } from '../../../environments'
import { JwtPayload } from './auth.types'

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies['gjafakort.token']
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

  async validate(req: Request, payload: JwtPayload) {
    const { csrfToken, user } = payload
    if (csrfToken && `Bearer ${csrfToken}` !== req.headers.authorization) {
      this.logger.error('invalid csrf token')
      return null
    }

    return user
  }
}
