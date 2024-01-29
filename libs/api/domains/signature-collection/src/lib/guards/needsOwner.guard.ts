import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { BYPASS_AUTH_KEY, getRequest } from '@island.is/auth-nest-tools'
import { OwnerAccess } from '../decorators/needsOwner.decorator'

@Injectable()
export class NeedsOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const bypassAuth = this.reflector.getAllAndOverride<boolean>(
      BYPASS_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    )

    // if the bypass auth exists and is truthy we bypass auth
    if (bypassAuth) {
      return true
    }
    const isOwner = this.reflector.get<OwnerAccess>(
      'is-owner',
      context.getHandler(),
    )
    // IsOwner decorator not used
    if (!isOwner) {
      return true
    }

    const request = getRequest(context)

    const { signee } = request.body
    const user = request.user
    const isDelegatedUser = !!user?.actor?.nationalId
    if (signee.isOwner) {
      if (isDelegatedUser) {
        return isOwner === OwnerAccess.AllowActor ? true : false
      }
      return true
    }

    return false
  }
}
