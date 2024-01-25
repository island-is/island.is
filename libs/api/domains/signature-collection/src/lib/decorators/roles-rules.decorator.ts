import { UserRole } from '@island.is/clients/signature-collection'
import { SetMetadata } from '@nestjs/common'



export const RolesRules = (...rules: UserRole[]) =>
  SetMetadata('roles-rules', rules)
