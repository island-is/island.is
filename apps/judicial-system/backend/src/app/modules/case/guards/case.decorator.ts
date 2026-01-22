import { createParamDecorator } from '@nestjs/common'

import { Case } from '../../repository'

export const CurrentCase = createParamDecorator(
  (data, { args: [_1, { req }] }): Case => req.case,
)
