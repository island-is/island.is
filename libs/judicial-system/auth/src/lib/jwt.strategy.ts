import { Request } from 'express'
import { Strategy } from 'passport-jwt'

import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import type { User } from '@island.is/judicial-system/types'

import { Credentials } from './auth.types'
import { cookieExtractor } from './cookieExtractor'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('JWT_SECRET')
    jwtSecret: string,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
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
