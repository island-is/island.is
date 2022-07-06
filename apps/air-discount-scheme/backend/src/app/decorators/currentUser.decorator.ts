import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AuthUser } from '@island.is/air-discount-scheme/types'
import { getUserFromContext } from '../lib'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthUser => {
    return getUserFromContext(context)
  },
)
