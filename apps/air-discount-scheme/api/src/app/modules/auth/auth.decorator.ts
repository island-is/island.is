import { createParamDecorator } from '@nestjs/common'

import { User } from '../user'

export const CurrentUser = createParamDecorator(
  (data, [_1, _2, { req }]): User => req.user,
)
