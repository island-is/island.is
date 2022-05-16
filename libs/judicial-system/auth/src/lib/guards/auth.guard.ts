import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import type { User } from '@island.is/judicial-system/types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly allowNonUsers = false) {
    super()
  }

  handleRequest<TUser extends User>(err: Error, user: TUser): TUser {
    if (err || !user || (!user.id && !this.allowNonUsers)) {
      throw new UnauthorizedException(err?.message ?? 'Unauthorized')
    }

    return user
  }
}
