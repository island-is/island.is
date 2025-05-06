import { Request } from 'express'
import { Strategy } from 'passport-jwt'

import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { type ConfigType } from '@island.is/nest/config'

import { sharedAuthModuleConfig } from './auth.config'
import { AuthUser, Credentials } from './auth.types'
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

  validate(
    req: Request,
    { currentUserNationalId, currentUser, csrfToken }: Credentials,
  ): AuthUser | undefined {
    if (csrfToken && `Bearer ${csrfToken}` !== req.headers['authorization']) {
      return undefined
    }

    return { currentUserNationalId, currentUser }
  }
}
