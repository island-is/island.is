import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getAuthorizationHeader } from '../utils/tokenUtils'

export const AuthorizationHeader = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    return getAuthorizationHeader(ctx)
  },
)
