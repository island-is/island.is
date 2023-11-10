import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { BYPASS_AUTH_KEY } from './bypass-auth.decorator'
import { getRequest } from './getRequest'
import { User } from './user'

@Injectable()
export class IdsUserGuard extends AuthGuard('jwt') {
  getRequest = getRequest
  constructor(private readonly reflector: Reflector) {
    super()
  }

  handleRequest<TUser extends User>(
    error: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ) {
    // Throws if there is an error or missing user.
    super.handleRequest(error, user, info, context, status)
    // Check if there's a nationalId claim for an authenticated user.
    if (!user.nationalId) {
      throw new UnauthorizedException()
    }
    // AuthGuard saves user in request.user. We'll also save it as request.auth.
    const request = this.getRequest(context)
    request.auth = user
    return user
  }

  canActivate(context: ExecutionContext) {
    // we check for metadata set by the bypass auth decorator
    const bypassAuth = this.reflector.getAllAndOverride<boolean>(
      BYPASS_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    )

    // if the bypass auth exists and is truthy we bypass auth
    if (bypassAuth) {
      return true
    }
    // pass auth checking to JWT auth guard
    return super.canActivate(context)
  }
}
