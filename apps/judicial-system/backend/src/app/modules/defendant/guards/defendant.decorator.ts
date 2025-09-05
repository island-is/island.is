import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Defendant } from '../../repository'

export const CurrentDefendant = createParamDecorator(
  (data: unknown, context: ExecutionContext): Defendant => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.defendant
  },
)
