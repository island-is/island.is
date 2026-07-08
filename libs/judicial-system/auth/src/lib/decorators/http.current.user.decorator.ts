import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'

export const CurrentHttpUser = createParamDecorator(
  (data, context: ExecutionContext): User =>
    context.switchToHttp().getRequest().user?.currentUser,
)
