import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentGraphQlUserNationalId = createParamDecorator(
  (data, context: ExecutionContext): string | undefined =>
    GqlExecutionContext.create(context).getContext().req.user
      ?.currentUserNationalId,
)
