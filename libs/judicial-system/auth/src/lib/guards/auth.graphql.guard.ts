import { AuthenticationError } from 'apollo-server-express'

import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from '../auth.types'

@Injectable()
export class JwtGraphQlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  handleRequest<TUser extends AuthUser>(err: Error, user?: TUser): TUser {
    if (err || !user) {
      throw new AuthenticationError(err?.message ?? 'Unauthorized')
    }

    return user
  }
}
