import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { ExecutionContext, UseGuards } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { AuthGuard } from '@nestjs/passport'

import { Role, AuthUser } from './auth.types'
import { AuthService } from './auth.service'

type AuthorizeOptions = {
  throwOnUnAuthorized?: boolean
  role?: Role
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

  handleRequest<TUser extends AuthUser>(err: Error, user: TUser): TUser {
    const { throwOnUnAuthorized, role } = this.options
    if (throwOnUnAuthorized && (err || !user)) {
      throw new AuthenticationError((err && err.message) || 'Unauthorized')
    }
    console.log('auth.guard before calling checkRole...')
    console.log('at start of checkRole User:' + user)
    console.log('at start of checkRole User:' + JSON.stringify(user, null, 2))
    console.log('at start of checkRole Role:' + role)
    if (typeof user === 'boolean') {
      console.log(
        '++++++++++++++++++++++++user was boolean strange case +++++++++++++++++',
      )
      return user
    } else {
      if (!authService.checkRole(user, role)) {
        throw new ForbiddenError('Forbidden')
      }
      return user
    }
    // if (!user) {
    // user.name = 'Gaur'
    //user.nationalId = '1234567890'
    //    role = 'citizen'
    // }
  }
}

export const Authorize = (
  { throwOnUnAuthorized = true, role }: AuthorizeOptions = {
    throwOnUnAuthorized: true,
    role: undefined,
  },
): MethodDecorator & ClassDecorator => {
  return UseGuards(new GraphQLAuthGuard({ throwOnUnAuthorized, role }))
}
