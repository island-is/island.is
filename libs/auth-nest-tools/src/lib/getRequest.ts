import { ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { GraphQLContext } from './graphql.context'

export const getRequest = (
  context: ExecutionContext & { contextType?: string },
): GraphQLContext['req'] => {
  if (context.contextType === 'graphql') {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext<GraphQLContext>().req
  }

  return context.switchToHttp().getRequest()
}
