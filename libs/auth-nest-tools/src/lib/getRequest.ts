import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const getRequest = (context: ExecutionContext & { contextType?: string }) => {
  if (context.contextType === 'graphql') {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  return context.switchToHttp().getRequest()
}
