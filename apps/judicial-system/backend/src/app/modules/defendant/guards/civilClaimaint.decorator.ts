import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { CivilClaimant } from '../../repository'

export const CurrentCivilClaimant = createParamDecorator(
  (data: unknown, context: ExecutionContext): CivilClaimant => {
    const ctx = context.getArgByIndex(1)
    return ctx?.req?.civilClaimant
  },
)
