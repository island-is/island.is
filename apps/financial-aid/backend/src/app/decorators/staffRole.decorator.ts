import { SetMetadata } from '@nestjs/common'

import { StaffRole } from '@island.is/financial-aid/shared/lib'

export const StaffRolesRules = (...rules: StaffRole[]) =>
  SetMetadata('staff-roles-rules', rules)
