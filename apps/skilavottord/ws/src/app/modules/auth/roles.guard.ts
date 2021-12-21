import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ForbiddenError } from 'apollo-server-express'

import { getRequest } from '@island.is/auth-nest-tools'

import { Role } from './user.model'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private matchRoles(roles, user) {
    if (
      roles &&
      roles.length > 0 &&
      !roles.find((role) => role === user.role)
    ) {
      throw new ForbiddenError('Forbidden')
    }
    return true
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles) {
      return true
    }

    const request = getRequest(context)
    return this.matchRoles(roles, request.user)
  }
}
