import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'

import { User } from '@island.is/financial-aid/shared/lib'
import { getUserFromContext } from '../lib'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const user = getUserFromContext(context)
    if (!user) {
      throw new BadRequestException('Invalid user')
    }
    return user
  },
)
