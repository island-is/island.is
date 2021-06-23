import { createParamDecorator } from '@nestjs/common'

import { User } from '@island.is/financial-aid/shared'

export const CurrentGraphQlUser = createParamDecorator(
  (data, { args: [_1, _2, { req }] }): User => req.user,
)
