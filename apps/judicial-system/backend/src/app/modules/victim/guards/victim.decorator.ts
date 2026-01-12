import { createParamDecorator } from '@nestjs/common'

import { Victim } from '../../repository'

export const CurrentVictim = createParamDecorator(
  (data, { args: [_1, { req }] }): Victim => req.victim,
)
