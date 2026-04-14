import { OmitType, PartialType } from '@nestjs/swagger'

import { AdminCreateTenantDto } from './admin-create-tenant.dto'

/** All fields from AdminCreateTenantDto except `name`, all optional. */
export class AdminPatchTenantDto extends PartialType(
  OmitType(AdminCreateTenantDto, ['name'] as const),
) {}
