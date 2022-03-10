import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { User } from '@island.is/financial-aid/shared/lib'
import { getUserFromContext } from '../lib'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    return getUserFromContext(context)
  },
)
