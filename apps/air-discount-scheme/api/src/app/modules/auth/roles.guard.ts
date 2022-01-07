import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { getRole } from './roles'
import { getUserFromContext } from './getUserFromContext'
import { Role } from '@island.is/air-discount-scheme/types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRules = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    )

    // Allow if no rules
    if (!rolesRules) {
      return true
    }

    const user = getUserFromContext(context)
    console.log('roles.guard user')
    console.log(user)
    // Deny if no user
    if (!user) {
      throw new UnauthorizedException()
    }

    const userRole = user.role//getRole({name: user.name, nationalId: user.nationalId, })
    console.log(userRole)

    if (!rolesRules.includes(userRole)) {
      throw new UnauthorizedException()
    }
    return true
  }
}
