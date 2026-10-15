import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AppealSummons } from '../../repository'

export const CurrentAppealSummons = createParamDecorator(
  (data, context: ExecutionContext): AppealSummons =>
    context.switchToHttp().getRequest().appealSummons,
)
