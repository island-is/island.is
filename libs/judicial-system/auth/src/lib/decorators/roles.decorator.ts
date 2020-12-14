import { SetMetadata } from '@nestjs/common'

import { RolesRule } from '../auth.types'

export const RolesRules = (...rules: RolesRule[]) =>
  SetMetadata('roles-rules', rules)
