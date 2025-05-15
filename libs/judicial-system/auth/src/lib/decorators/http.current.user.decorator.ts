import { createParamDecorator } from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'

export const CurrentHttpUser = createParamDecorator(
  (data, { args: [_1, { req }] }): User => req.user?.currentUser,
)
