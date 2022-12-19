import { createParamDecorator } from '@nestjs/common'

import { User } from '../../user'

export const CurrentUser = createParamDecorator(
  (data, { args: [_1, { req }] }): User => req.user,
)
