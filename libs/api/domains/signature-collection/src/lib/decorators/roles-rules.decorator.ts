import { SetMetadata } from '@nestjs/common'

import { UserRole } from '../utils/role.types'

export const RolesRules = (...rules: UserRole[]) =>
  SetMetadata('roles-rules', rules)
