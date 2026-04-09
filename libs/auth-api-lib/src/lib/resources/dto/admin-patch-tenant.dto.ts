import { OmitType, PartialType } from '@nestjs/swagger'

import { AdminCreateTenantDto } from './admin-create-tenant.dto'

/**
 * Only `name` is immutable — it is the domain's primary key and is
 * FK-referenced by Client, ApiScope and ApiScopeGroup. Every other field,
 * including `nationalId`, can be updated via PATCH (matching the legacy
 * admin UI's behaviour).
 */
export class AdminPatchTenantDto extends PartialType(
  OmitType(AdminCreateTenantDto, ['name'] as const),
) {}
