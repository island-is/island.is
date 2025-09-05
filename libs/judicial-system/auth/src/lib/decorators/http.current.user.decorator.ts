import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'

export const CurrentHttpUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.user?.currentUser
  },
)
