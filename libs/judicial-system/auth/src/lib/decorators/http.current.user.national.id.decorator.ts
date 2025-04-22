import { createParamDecorator } from '@nestjs/common'

import type { User } from '@island.is/judicial-system/types'

export const CurrentHttpUserNationalId = createParamDecorator(
  (data, { args: [_1, { req }] }): User => req.user?.currentUserNationalId,
)
