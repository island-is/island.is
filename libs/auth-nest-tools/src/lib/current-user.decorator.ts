import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { logger } from '@island.is/logging'

import { User } from './user'
import { getRequest } from './getRequest'

export const getCurrentUser = (
  context: ExecutionContext & { contextType?: string },
): User => {
  const resolveUser = () => {
    if (context.contextType === 'graphql') {
      const ctx = GqlExecutionContext.create(context)
      const { req } = ctx.getContext()
      return req.user
    } else {
      const request = getRequest(context)
      return request.user
    }
  }

  const user = resolveUser()
  if (!user) {
    logger.warn(
      'No user authentication found. Did you forget to add IdsUserGuard?',
    )
    throw new UnauthorizedException()
  }
  return user
}

export const CurrentUser = createParamDecorator(
  (options: unknown, context: ExecutionContext): User => {
    return getCurrentUser(context)
  },
)
