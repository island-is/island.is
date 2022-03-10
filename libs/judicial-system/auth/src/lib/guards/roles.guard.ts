import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
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
      typeof rule === 'string' ? rule === user.role : rule?.role === user.role,
    )

    // Deny if no rule matches the user's role
    if (!rule) {
      return false
    }

    // Allow if the rule is simple a user role
    if (typeof rule === 'string') {
      return true
    }

    const dto = request.body

    if (!dto) {
      return false
    }

    if (rule.type === RulesType.FIELD) {
      const dtoFields = Object.keys(dto)

      // Allow if all the dto fields are included in the rule
      return dtoFields.every((field) => rule.dtoFields?.includes(field))
    }

    if (rule.type === RulesType.FIELD_VALUES) {
      // Allow if the value of the specified dto field is included in the rule
      return rule.dtoFieldValues?.includes(dto[rule.dtoField])
    }

    // Deny if the rule type is unknown
    return false
  }
}
