import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { User } from '@island.is/financial-aid/shared'

import { RolesRule } from '../auth.types'

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
    const rule = rolesRules.find((rule) =>
      typeof rule === 'string' ? rule === user.service : rule === user.service,
    )

    // Deny if no rule matches the user's role
    if (!rule) {
      return false
    }

    // Allow if the rule is simple a user role
    if (typeof rule === 'string') {
      return true
    }

    // Deny if the rule type is unknown
    return false
  }
}
