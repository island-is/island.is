import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { Case } from '../../repository'

export const CurrentCase = createParamDecorator(
  (data: unknown, context: ExecutionContext): Case => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.case
  },
)
