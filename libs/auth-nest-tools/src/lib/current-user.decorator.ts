import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { User } from './user'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const user = request.user

    return {
      ...user,
      authorization: request.headers.authorization,
    }
  },
)

export const getCurrentUser = (context: ExecutionContext): User => {
  const request = context.switchToHttp().getRequest()
  const user = request.user

  if (!user) {
    throw new UnauthorizedException('You are not authenticated')
  }

  return {
    ...user,
    authorization: request.headers.authorization,
  }
}

export const CurrentRestUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => getCurrentUser(context),
)
