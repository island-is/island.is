import { AuthenticationError } from 'apollo-server-express'
import { ExecutionContext, UseGuards } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { AuthGuard } from '@nestjs/passport'

import { Role, AuthUser } from './auth.types'

type AuthorizeOptions = {
  throwOnUnAuthorized?: boolean
  roles?: Role[]
}

class GraphQLAuthGuard extends AuthGuard('jwt') {
  options: AuthorizeOptions

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    req.authGuardOptions = this.options
    return super.canActivate(new ExecutionContextHost([req]))
  }

  handleRequest<TUser extends AuthUser>(err: Error, user: TUser): TUser {
    const { throwOnUnAuthorized } = this.options
    if (throwOnUnAuthorized && (err || !user)) {
      throw new AuthenticationError((err && err.message) || 'Unauthorized')
    }

    return user
  }
}

export const Authorize = (
  { throwOnUnAuthorized = true, roles }: AuthorizeOptions = {
    throwOnUnAuthorized: true,
    roles: [],
  },
): MethodDecorator & ClassDecorator => {
  return UseGuards(new GraphQLAuthGuard({ throwOnUnAuthorized, roles }))
}
