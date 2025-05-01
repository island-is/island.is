import { createParamDecorator } from '@nestjs/common'

export const CurrentHttpUserNationalId = createParamDecorator(
  (data, { args: [_1, { req }] }): string => req.user?.currentUserNationalId,
)
