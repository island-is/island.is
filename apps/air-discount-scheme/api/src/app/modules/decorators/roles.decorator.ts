import { SetMetadata } from '@nestjs/common'
import { Role } from '@island.is/air-discount-scheme/types'

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)
