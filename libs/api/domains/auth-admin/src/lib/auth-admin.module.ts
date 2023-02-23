import { Module } from '@nestjs/common'

import { TenantResolver } from './tenant/tenant.resolver'
import { TenantEnvironmentResolver } from './tenant/tenant-environment.resolver'
import { TenantsService } from './tenant/tenants.service'
import { TenantMergedEnvironmentResolver } from './tenant/tenant-merged-environment.resolver'

@Module({
  controllers: [],
  providers: [
    TenantResolver,
    TenantEnvironmentResolver,
    TenantMergedEnvironmentResolver,
    TenantsService,
  ],
  exports: [
    TenantResolver,
    TenantEnvironmentResolver,
    TenantMergedEnvironmentResolver,
  ],
})
export class AuthAdminModule {}
