import { Strategy } from 'passport-jwt'
import { Request } from 'express'

import { Injectable, Inject } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/judicial-system/types'

import { Credentials } from './auth.types'
import environment from './environment'
import { cookieExtractor } from './cookieExtractor'

const { jwtSecret } = environment

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, { csrfToken, user }: Credentials): User | undefined {
    if (csrfToken && `Bearer ${csrfToken}` !== req.headers['authorization']) {
      this.logger.error('invalid csrf token')
      return undefined
    }

    return user
  }
}
