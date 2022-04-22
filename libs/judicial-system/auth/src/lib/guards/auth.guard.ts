import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { User, UserRole } from '@island.is/judicial-system/types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends User>(err: Error, user: TUser): TUser {
    if (err || !user || user.role === UserRole.DEFENDER) {
      throw new UnauthorizedException(err?.message ?? 'Unauthorized')
    }

    return user
  }
}
