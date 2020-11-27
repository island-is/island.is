import { createParamDecorator } from '@nestjs/common'

import { User } from '@island.is/judicial-system/types'

export const CurrentUser = createParamDecorator(
  (data, { args: [_1, _2, { req }] }): User => req.user,
)
