import { createParamDecorator } from '@nestjs/common'

import { Verdict } from '../models/verdict.model'

export const CurrentVerdict = createParamDecorator(
  (data, { args: [_1, { req }] }): Verdict => req.verdict,
)
