import { AuthenticationError } from 'apollo-server-express'

import { Injectable, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { User, UserRole } from '@island.is/judicial-system/types'

@Injectable()
export class JwtGraphQlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly allowNonUsers = false) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    return super.canActivate(new GqlExecutionContext([req]))
  }

  handleRequest<TUser extends User>(err: Error, user: TUser): TUser {
    if (
      err ||
      !user ||
      (user.role === UserRole.DEFENDER && !this.allowNonUsers)
    ) {
      throw new AuthenticationError(err?.message ?? 'Unauthorized')
    }

    return user
  }
}
