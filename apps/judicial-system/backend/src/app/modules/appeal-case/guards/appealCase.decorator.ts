import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AppealCase } from '../../repository'

export const CurrentAppealCase = createParamDecorator(
  (data, context: ExecutionContext): AppealCase =>
    context.switchToHttp().getRequest().appealCase,
)
