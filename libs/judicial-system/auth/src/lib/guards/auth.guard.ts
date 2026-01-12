import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from '../auth.types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends AuthUser>(err: Error, user?: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException(err?.message ?? 'Unauthorized')
    }

    return user
  }
}
