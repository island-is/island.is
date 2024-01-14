import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
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
    const rolesRules = this.reflector.get<UserRole[]>(
      'roles-rules',
      context.getHandler(),
    )
    if (!rolesRules) {
      return true
    }

    const request = getRequest(context)
    const { role } = request.body
    if (!rolesRules.includes(role)) {
      throw new UnauthorizedException()
    }

    return true
  }
}
