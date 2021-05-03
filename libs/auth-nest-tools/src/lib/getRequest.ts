import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const getRequest = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest()

  if (request) {
    return request
  } else {
    const ctx = GqlExecutionContext.create(context)

    return ctx.getContext().req
  }
}
