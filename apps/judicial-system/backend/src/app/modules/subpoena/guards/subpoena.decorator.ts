import { createParamDecorator } from '@nestjs/common'

import { Subpoena } from '../../repository'

export const CurrentSubpoena = createParamDecorator(
  (data, { args: [_1, { req }] }): Subpoena => req.subpoena,
)
