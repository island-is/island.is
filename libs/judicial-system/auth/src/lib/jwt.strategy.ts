import { Request } from 'express'
import { Strategy } from 'passport-jwt'

import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { type ConfigType } from '@island.is/nest/config'

import { type User } from '@island.is/judicial-system/types'

import { sharedAuthModuleConfig } from './auth.config'
import { Credentials } from './auth.types'
import { cookieExtractor } from './cookieExtractor'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(sharedAuthModuleConfig.KEY)
    private readonly config: ConfigType<typeof sharedAuthModuleConfig>,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.jwtSecret,
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
