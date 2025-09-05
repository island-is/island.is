import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Victim } from '../../repository'

export const CurrentVictim = createParamDecorator(
  (data: unknown, context: ExecutionContext): Victim => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.victim
  },
)
