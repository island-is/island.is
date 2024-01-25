import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'

import { getRequest } from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'
import { UserWithRole } from '@island.is/clients/signature-collection'

export const getCurrentRole = (context: ExecutionContext): UserWithRole => {
  const request = getRequest(context)
  const user = request.user
  const role = request.body.role
  if (!user) {
    logger.warn(
      'No user authentication found. Did you forget to add IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }
  return {...user, role}
}

export const CurrentRole = createParamDecorator(
  (options: unknown, context: ExecutionContext): UserWithRole => {
    return getCurrentRole(context)
  },
)
