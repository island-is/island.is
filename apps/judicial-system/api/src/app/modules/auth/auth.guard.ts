import { AuthenticationError } from 'apollo-server-express'

import { Injectable, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from './auth.types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    return super.canActivate(new GqlExecutionContext([req]))
  }

  handleRequest<TUser extends AuthUser>(err: Error, user: TUser): TUser {
    if (err || !user) {
      throw new AuthenticationError((err && err.message) || 'Unauthorized')
    }

    return user
  }
}
