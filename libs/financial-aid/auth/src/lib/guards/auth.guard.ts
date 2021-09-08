import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { User } from '@island.is/financial-aid/shared/lib'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends User>(err: Error, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException((err && err.message) || 'Unauthorized')
    }

    return user
  }
}
