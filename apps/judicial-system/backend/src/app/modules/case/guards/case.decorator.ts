import { createParamDecorator } from '@nestjs/common'

import { Case } from '../models'

export const CurrentCase = createParamDecorator(
  (data, { args: [_1, { req }] }): Case => req.case,
)
