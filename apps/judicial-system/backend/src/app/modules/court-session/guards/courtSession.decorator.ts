import { createParamDecorator } from '@nestjs/common'

import { CourtSession } from '../../repository'

export const CurrentCourtSession = createParamDecorator(
  (data, { args: [_1, { req }] }): CourtSession => req.courtSession,
)
