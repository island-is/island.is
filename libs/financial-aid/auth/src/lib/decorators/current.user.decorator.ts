import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'

import { getUserFromContext, User } from '@island.is/financial-aid/shared/lib'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const user = getUserFromContext(context)
    if (!user) {
      throw new BadRequestException('Invalid user')
    }
    return user
  },
)
