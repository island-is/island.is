import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getAuthorizationHeader } from './tokenUtils'

export const AuthorizationHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getAuthorizationHeader(ctx)
  },
)
