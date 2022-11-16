import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { getRole } from './roles'
import { Role } from '@island.is/air-discount-scheme/types'
import { getUserFromContext } from './getUserFromContext'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRules = this.reflector.get<Role[]>('roles', context.getHandler())
    // Allow if no rules
    if (!rolesRules) {
      return true
    }
    const user = getUserFromContext(context)
    user.role = getRole({ name: user.name, nationalId: user.nationalId })

    // Deny if no user
    if (!user) {
      throw new UnauthorizedException()
    }

    if (!rolesRules.includes(user.role)) {
      throw new UnauthorizedException()
    }
    return true
  }
}
