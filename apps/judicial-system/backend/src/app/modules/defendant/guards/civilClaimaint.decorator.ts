import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { CivilClaimant } from '../../repository'

export const CurrentCivilClaimant = createParamDecorator(
  (data, context: ExecutionContext): CivilClaimant =>
    context.switchToHttp().getRequest().civilClaimant,
)
