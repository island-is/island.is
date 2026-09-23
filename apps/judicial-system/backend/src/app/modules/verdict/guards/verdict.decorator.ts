import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Verdict } from '../../repository'

export const CurrentVerdict = createParamDecorator(
  (data, context: ExecutionContext): Verdict =>
    context.switchToHttp().getRequest().verdict,
)
