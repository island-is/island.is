import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { User } from '@island.is/judicial-system/types'

export const CurrentGraphQlUser = createParamDecorator(
  (data, context: ExecutionContext): User =>
    GqlExecutionContext.create(context).getContext().req.user?.currentUser,
)
