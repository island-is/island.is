import { createParamDecorator } from '@nestjs/common'

import { Defendant } from '../../repository'

export const CurrentDefendant = createParamDecorator(
  (data, { args: [_1, { req }] }): Defendant => req.defendant,
)
