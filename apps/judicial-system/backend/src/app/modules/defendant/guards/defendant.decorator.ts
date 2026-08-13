import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Defendant } from '../../repository'

export const CurrentDefendant = createParamDecorator(
  (data, context: ExecutionContext): Defendant =>
    context.switchToHttp().getRequest().defendant,
)
