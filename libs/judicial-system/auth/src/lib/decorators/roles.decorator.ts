import { SetMetadata } from '@nestjs/common'

import { RolesRule } from '../auth.types'

export const Roles = (...roles: (string | RolesRule)[]) =>
  SetMetadata('roles', roles)
