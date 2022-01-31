import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { BYPASS_AUTH_KEY } from './bypass-auth.decorator'
import { getRequest } from './getRequest'

@Injectable()
export class IdsAuthGuard extends AuthGuard('jwt') {
  getRequest = getRequest
  constructor(private readonly reflector: Reflector) {
    super()
  }

  getAuthenticateOptions() {
    return {
      property: 'auth',
    }
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
