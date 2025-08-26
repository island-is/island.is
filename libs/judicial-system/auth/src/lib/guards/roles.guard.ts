import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import type { User } from '@island.is/judicial-system/types'

import { RolesRule, RulesType } from '../auth.types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRules = this.reflector.get<RolesRule[]>(
      'roles-rules',
      context.getHandler(),
    )

    // Deny if no rules
    if (!rolesRules) {
      return false
    }

    const request = context.switchToHttp().getRequest()
    const user: User = request.user?.currentUser

    // Deny if no user
    if (!user) {
      return false
    }

    // Pick the first matching rule
    const rule = rolesRules.find((rule) =>
      typeof rule === 'string' ? rule === user.role : rule?.role === user.role,
    )

    // Deny if no rule matches the user's role
    if (!rule) {
      return false
    }

    // Allow if the rule is simply a user role
    if (typeof rule === 'string') {
      return true
    }

    switch (rule.type) {
      case RulesType.BASIC:
        break
      case RulesType.FIELD:
        // Deny if some dto fields are not included in the rule
        if (
          !request.body ||
          !Object.keys(request.body).every((field) =>
            rule.dtoFields?.includes(field),
          )
        ) {
          return false
        }
        break
      case RulesType.FIELD_VALUES:
        // Deny if the value of the specified dto field is not included in the rule
        if (
          !request.body ||
          !rule.dtoFieldValues?.includes(request.body[rule.dtoField])
        ) {
          return false
        }
        break
      default:
        // Deny if the rule type is unknown
        return false
    }

    if (rule.canActivate) {
      // Let the rule decide
      return rule.canActivate(request)
    }

    // Accept after all checks succeeded
    return true
  }
}
