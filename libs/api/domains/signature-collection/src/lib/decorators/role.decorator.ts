import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getRequest } from '@island.is/auth-nest-tools'
import { UserRole } from '../utils/role.types'

export const getCurrentRole = (context: ExecutionContext): UserRole => {
  const request = getRequest(context)

  return request.body.role
}

export const CurrentRole = createParamDecorator(
  (options: unknown, context: ExecutionContext): UserRole => {
    return getCurrentRole(context)
  },
)
