import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { logger } from '@island.is/logging'

import { User } from './user'
import { getRequest } from './getRequest'

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
        sub: user.sub,
        sid: user.sid,
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
