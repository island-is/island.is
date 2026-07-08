import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Victim } from '../../repository'

export const CurrentVictim = createParamDecorator(
  (data, context: ExecutionContext): Victim =>
    context.switchToHttp().getRequest().victim,
)
