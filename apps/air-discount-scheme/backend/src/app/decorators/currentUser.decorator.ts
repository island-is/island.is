import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AuthUser } from '@island.is/air-discount-scheme/types'
import { getUserFromContext } from '../lib'

export const CurrentUser = createParamDecorator(
  async (_: unknown, context: ExecutionContext): Promise<AuthUser> => {
    return getUserFromContext(context)
  },
)
