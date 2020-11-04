import { createParamDecorator } from '@nestjs/common'

import { AuthUser } from './auth.types'

export const CurrentAuthUser = createParamDecorator(
  (data, { args: [_1, _2, { req }] }): AuthUser => req.user,
)
