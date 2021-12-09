import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { ExecutionContext, UseGuards } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { AuthGuard } from '@nestjs/passport'

import { Role, AuthUser } from './auth.types'
import { AuthService } from './auth.service'
import { getSession, signIn } from 'next-auth/client'

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

  // canActivate(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context)
  //   const { req } = ctx.getContext()

  //   return super.canActivate(new ExecutionContextHost([req]))
  // return getSession()
  // }
  
  session = getSession()
  canActivate(session) {
    console.log('auth guard session is authenticated: ' + session.isAuthenticated)
    return session.isAuthenticated
  }
  
  handleRequest<TUser extends AuthUser>(err: Error, user: TUser): TUser {
    const { throwOnUnAuthorized, role } = this.options
    if (throwOnUnAuthorized && (err || !user)) {
      console.log('inside handlerequest auth.guard')
      signIn('identity-server', {
        callbackUrl: `${window.location.href}`
      })
      //throw new AuthenticationError((err && err.message) || 'Unauthorized')
    }

    if (!authService.checkRole(user, role)) {
      throw new ForbiddenError('Forbidden')
    }

    return user
  }
}

export const Authorize = (
  { throwOnUnAuthorized = true, role }: AuthorizeOptions = {
    throwOnUnAuthorized: true,
    role: undefined,
  },
): MethodDecorator & ClassDecorator => {
  console.log('auth guard authorize')
  return UseGuards(new GraphQLAuthGuard({ throwOnUnAuthorized, role }))
}
