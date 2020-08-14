import { createParamDecorator } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (data, [root, args, { req }]) => req.user,
)
