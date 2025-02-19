import { createParamDecorator } from '@nestjs/common'

import { CivilClaimant } from '../models/civilClaimant.model'

export const CurrentCivilClaimant = createParamDecorator(
  (data, { args: [_1, { req }] }): CivilClaimant => req.civilClaimant,
)
