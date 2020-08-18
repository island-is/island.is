import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { ExecutionContext, UseGuards } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { AuthGuard } from '@nestjs/passport'

import { Permissions } from './auth.types'
import { AuthService } from './auth.service'
import { User } from '../user'

type AuthorizeOptions = {
  throwOnUnAuthorized?: boolean
  permissions?: Permissions
}

// Can't use the Dependency Injection since GraphQLAuthGuard needs to
// be passed dynamic parameters. So creating a shared instance
// will have to do.
const authService = new AuthService()

class GraphQLAuthGuard extends AuthGuard('jwt') {
  options: AuthorizeOptions

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    return super.canActivate(new ExecutionContextHost([req]))
  }

  handleRequest<TUser extends User>(err: Error, user: TUser): TUser {
    const { throwOnUnAuthorized, permissions } = this.options
    if (throwOnUnAuthorized && (err || !user)) {
      new AuthenticationError((err && err.message) || 'Unauthorized')
    }

    if (!authService.checkPermissions(user, permissions)) {
      throw new ForbiddenError('Forbidden')
    }

    return user
  }
}

export const Authorize = ({
  throwOnUnAuthorized = true,
  permissions = {},
}: AuthorizeOptions): MethodDecorator & ClassDecorator => {
  return UseGuards(new GraphQLAuthGuard({ throwOnUnAuthorized, permissions }))
}
