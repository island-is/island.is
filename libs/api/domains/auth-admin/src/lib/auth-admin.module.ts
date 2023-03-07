import { Module } from '@nestjs/common'

import { TenantResolver } from './tenant/tenant.resolver'
import { TenantEnvironmentResolver } from './tenant/tenant-environment.resolver'
import { TenantsService } from './tenant/tenants.service'
import { ApplicationService } from './application/application.service'
import { ApplicationResolver } from './application/application.resolver'

@Module({
  controllers: [],
  providers: [
    TenantResolver,
    TenantEnvironmentResolver,
    TenantsService,
    ApplicationResolver,
    ApplicationService,
  ],
  exports: [TenantResolver, TenantEnvironmentResolver, ApplicationResolver],
})
export class AuthAdminModule {}
