import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from '../auth.types'

@Injectable()
export class JwtAuthUserGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends AuthUser>(err: Error, user?: TUser): TUser {
    if (err || !user?.currentUser) {
      throw new UnauthorizedException(err?.message ?? 'Unauthorized')
    }

    return user
  }
}
