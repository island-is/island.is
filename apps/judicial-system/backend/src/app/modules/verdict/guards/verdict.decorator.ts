import { createParamDecorator } from '@nestjs/common'

import { Verdict } from '../../repository'

export const CurrentVerdict = createParamDecorator(
  (data, { args: [_1, { req }] }): Verdict => req.verdict,
)
