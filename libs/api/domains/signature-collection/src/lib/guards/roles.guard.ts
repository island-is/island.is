import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { getRequest } from '@island.is/auth-nest-tools'
import { OwnerAccess } from '../decorators/isOwner.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
