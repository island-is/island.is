import { createParamDecorator, ExecutionContext } from '@nestjs/common'
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
