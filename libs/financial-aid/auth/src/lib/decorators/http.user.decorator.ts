import { createParamDecorator } from '@nestjs/common'

import { User } from '@island.is/financial-aid/shared/lib'

export const CurrentHttpUser = createParamDecorator(
  (data, { args: [_1, { req }] }): User => req.user,
)
