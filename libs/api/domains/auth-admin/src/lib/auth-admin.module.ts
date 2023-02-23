import { Module } from '@nestjs/common'

import { TenantResolver } from './tenant/tenant.resolver'
import { TenantEnvironmentResolver } from './tenant/tenant-environment.resolver'
import { TenantsService } from './tenant/tenants.service'

@Module({
  controllers: [],
  providers: [TenantResolver, TenantEnvironmentResolver, TenantsService],
  exports: [TenantResolver, TenantEnvironmentResolver],
})
export class AuthAdminModule {}
