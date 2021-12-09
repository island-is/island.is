import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { RolesRule } from '@island.is/financial-aid/shared/lib'
import { getUserFromContext } from '../lib/userContextExtractor'

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

    const user = getUserFromContext(context)

    // Deny if no user
    if (!user) {
      throw new UnauthorizedException()
    }

    // Pick the first matching rule
    const rule = rolesRules.find((rule) => {
      return rule === user.service
    })

    if (!rule) {
      throw new UnauthorizedException()
    }

    return true
  }
}
