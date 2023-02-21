import { Module } from '@nestjs/common'
import { TenantResolver } from './resolvers/tenant.resolver'
import { TenantsService } from './services/tenants.service'

@Module({
  controllers: [],
  providers: [TenantResolver, TenantsService],
  exports: [TenantResolver],
})
export class AuthAdminModule {}
