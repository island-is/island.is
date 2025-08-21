import { ArgumentsHost } from '@nestjs/common'
import { AuthRequest } from './auth.request'
import { GraphQLContext } from './graphql.context'

export const getRequest = (context: ArgumentsHost): AuthRequest => {
  if ((context.getType() as string) === 'graphql') {
    const ctx = context.getArgByIndex<GraphQLContext>(2)
    return ctx.req
  }

  return context.switchToHttp().getRequest()
}
