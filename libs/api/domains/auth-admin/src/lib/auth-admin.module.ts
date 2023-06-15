import { Module } from '@nestjs/common'

import { AuthAdminApiClientModule } from '@island.is/clients/auth/admin-api'

import { TenantResolver } from './tenant/tenant.resolver'
import { TenantEnvironmentResolver } from './tenant/tenant-environment.resolver'
import { TenantsService } from './tenant/tenants.service'
import { ClientsResolver } from './client/clients.resolver'
import { ClientsService } from './client/clients.service'
import { ClientEnvironmentResolver } from './client/client-environment.resolver'
import { ClientAllowedScopesLoader } from './client/client-allowed-scopes.loader'
import { ClientSecretLoader } from './client/client-secret.loader'
import { ScopeResolver } from './scope/scope.resolver'
import { ScopeService } from './scope/scope.service'

@Module({
  imports: [AuthAdminApiClientModule],
  providers: [
    TenantResolver,
    TenantEnvironmentResolver,
    TenantsService,
    ClientsResolver,
    ClientAllowedScopesLoader,
    ClientEnvironmentResolver,
    ClientsService,
    ClientSecretLoader,
    ScopeResolver,
    ScopeService,
  ],
})
export class AuthAdminModule {}
