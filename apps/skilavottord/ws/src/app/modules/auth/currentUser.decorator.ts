import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { getRequest } from '@island.is/auth-nest-tools'

import { User } from './user.model'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const req = getRequest(context)
    return req['user'] as unknown as User
  },
)
