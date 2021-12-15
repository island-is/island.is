import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/skilavottord/consts'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { AccessControlService } from '../accessControl'
import { Credentials, Role } from './auth.types'
import type { AuthUser, User } from './auth.types'

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies[ACCESS_TOKEN_COOKIE_NAME]
  }
  return null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(forwardRef(() => AccessControlService))
    private accessControlService: AccessControlService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: environment.auth.jwtSecret,
      passReqToCallback: true,
    })
  }

  private async getUser(user: AuthUser): Promise<User> {
    const accessControl = await this.accessControlService.findOne(
      user.nationalId,
    )
    if (accessControl) {
      return { ...user, ...accessControl } as User
    }
    return { ...user, role: Role.citizen }
  }

  async validate(req: Request, { csrfToken, user }: Credentials) {
    const authUser = await this.getUser(user)

    const { throwOnUnAuthorized, roles } = req['authGuardOptions']
    if (roles && !roles.find((role) => role === authUser.role)) {
      throw new ForbiddenError('Forbidden')
    }

    if (csrfToken && `Bearer ${csrfToken}` !== req.headers['authorization']) {
      this.logger.error('invalid csrf token -')
      return null
    }

    return authUser
  }
}
