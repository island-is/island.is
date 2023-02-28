import { createParamDecorator } from '@nestjs/common'

import { Defendant } from '../models/defendant.model'

export const CurrentDefendant = createParamDecorator(
  (data, { args: [_1, { req }] }): Defendant => req.defendant,
)
