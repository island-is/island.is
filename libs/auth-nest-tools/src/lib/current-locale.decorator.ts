import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Locale } from '@island.is/shared/types'

export const getCurrentLocale = (context: ExecutionContext): Locale => {
  const request = context.switchToHttp().getRequest()

  if (request) {
    return request.headers?.locale ?? 'is'
  }

  const ctx = GqlExecutionContext.create(context)
  const { headers } = ctx.getContext().req

  return headers?.locale ?? 'is'
}

export const CurrentLocale = createParamDecorator(
  (_: unknown, context: ExecutionContext): Locale => getCurrentLocale(context),
)
