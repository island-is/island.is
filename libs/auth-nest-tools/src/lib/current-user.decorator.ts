import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from './user'

export const getCurrentUser = (context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest()
  if (request) {
    return request.user
  }
  const ctx = GqlExecutionContext.create(context)
  const user = ctx.getContext().req.user
  if (!user) {
    throw new UnauthorizedException('You are not authenticated')
  }
  return user
}

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    return getCurrentUser(context)
  },
)

/**
 * @deprecated use CurrentUser decorator instead.
 */
export const CurrentRestUser = CurrentUser
