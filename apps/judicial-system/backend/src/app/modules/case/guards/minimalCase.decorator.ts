import { createParamDecorator } from '@nestjs/common'

import { MinimalCase } from '../models/case.types'

export const MinimalCurrentCase = createParamDecorator(
  (data, { args: [_1, { req }] }): MinimalCase => req.case,
)
