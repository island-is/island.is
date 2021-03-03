import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { Locale } from './locale'
import { User } from './user'

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext().req
    const user = request.user

    return {
      ...user,
      authorization: request.headers.authorization,
    }
  },
)

export const CurrentRestUser = createParamDecorator(
  (_, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    return {
      ...user,
      authorization: request.headers.authorization,
    }
  },
)

export const CurrentLocale = createParamDecorator(
  (_, context: ExecutionContext): Locale => {
    const ctx = GqlExecutionContext.create(context)
    const { headers } = ctx.getContext().req

    return headers?.locale ?? 'is'
  },
)
