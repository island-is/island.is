import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { logger } from '@island.is/logging'

import { getRequest } from './getRequest'
import { User } from './user'

export const getCurrentActor = (context: ExecutionContext): User => {
  const request = getRequest(context)

  const user = request.user

  if (!user) {
    logger.warn(
      'No user authentication found. Did you forget to add IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }

  return !user.actor
    ? user
    : {
        ...user.actor,
        client: user.client,
        authorization: user.authorization,
        ip: user.ip,
        userAgent: user.userAgent,
      }
}

export const CurrentActor = createParamDecorator(
  (options: unknown, context: ExecutionContext): User => {
    return getCurrentActor(context)
  },
)
