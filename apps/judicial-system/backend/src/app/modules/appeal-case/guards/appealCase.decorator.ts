import { createParamDecorator } from '@nestjs/common'

import { AppealCase } from '../../repository'

export const CurrentAppealCase = createParamDecorator(
  (data, { args: [_1, { req }] }): AppealCase => req.appealCase,
)
