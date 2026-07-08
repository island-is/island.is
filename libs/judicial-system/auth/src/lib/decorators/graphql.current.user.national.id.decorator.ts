import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { User } from '@island.is/judicial-system/types'

export const CurrentGraphQlUserNationalId = createParamDecorator(
  (data, context: ExecutionContext): User =>
    GqlExecutionContext.create(context).getContext().req.user
      ?.currentUserNationalId,
)
