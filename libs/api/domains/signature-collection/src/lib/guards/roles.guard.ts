import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { UserRole } from '../utils/role.types'
import { getRequest } from '@island.is/auth-nest-tools'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('in here')
    const rolesRules = this.reflector.get<UserRole[]>(
      'roles-rules',
      context.getHandler(),
    )

    const request = getRequest(context)
    const { roles, collection } = request.body
    console.log(roles)
    console.log(collection)
    return true
  }
}
