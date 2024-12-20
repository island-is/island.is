import { createParamDecorator } from '@nestjs/common'

import { Subpoena } from '../models/subpoena.model'

export const CurrentSubpoena = createParamDecorator(
  (data, { args: [_1, { req }] }): Subpoena => req.subpoena,
)
