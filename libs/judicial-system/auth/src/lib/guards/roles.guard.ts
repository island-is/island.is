import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { User } from '@island.is/judicial-system/types'

import { RolesRule } from '../auth.types'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<(string | RolesRule)[]>(
      'roles',
      context.getHandler(),
    )

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: User = request.user

    const rule = roles.find((rule) =>
      typeof rule === 'string' ? rule === user.role : rule?.role === user.role,
    )

    if (!rule) {
      return false
    }

    if (typeof rule === 'string') {
      return true
    }

    const dto = request.body

    if (!dto) {
      return false
    }

    const dtoFields = Object.keys(dto)

    return dtoFields.every((field) => rule.dtoFields.includes(field))
  }
}
