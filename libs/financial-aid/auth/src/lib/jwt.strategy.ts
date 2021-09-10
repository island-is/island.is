import { Strategy } from 'passport-jwt'
import { Request } from 'express'

import { Injectable, Inject } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { User } from '@island.is/financial-aid/shared/lib'

import { Credentials } from './auth.types'
import { authCookieExtractor } from './authCookieExtractor'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('JWT_SECRET')
    jwtSecret: string,
  ) {
    super({
      jwtFromRequest: authCookieExtractor,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, { csrfToken, user }: Credentials): User | undefined {
    if (csrfToken && `Bearer ${csrfToken}` !== req.headers['authorization']) {
      return undefined
    }

    return user
  }
}
