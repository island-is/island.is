import { PickType } from '@nestjs/swagger'

import { LoginRestriction } from '../login-restriction.model'

export class LoginRestrictionDto extends PickType(LoginRestriction, [
  'nationalId',
  'phoneNumber',
  'restrictedUntil',
] as const) {}
