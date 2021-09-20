import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { User, RolesRule } from '@island.is/financial-aid/shared/lib'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRules = this.reflector.get<RolesRule[]>(
      'roles-rules',
      context.getHandler(),
    )

    // Allow if no rules
    if (!rolesRules) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    // Deny if no user
    if (!user) {
      return false
    }

    // Pick the first matching rule
    const rule = rolesRules.find((rule) => {
      return rule === user.service
    })

    return Boolean(rule)
  }
}
