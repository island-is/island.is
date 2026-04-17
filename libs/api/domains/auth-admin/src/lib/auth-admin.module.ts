import { Module } from '@nestjs/common'

import { AuthAdminApiClientModule } from '@island.is/clients/auth/admin-api'
import { CmsModule } from '@island.is/cms'

import { ApiScopeUserResolver } from './api-scope-user/api-scope-user.resolver'
import { ApiScopeUserService } from './api-scope-user/api-scope-user.service'
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
import { DelegationProviderService } from './delegationProvider/delegation-provider.service'
import { DelegationProviderResolver } from './delegationProvider/delegation-provider.resolver'
import { DelegationAdminResolver } from './delegationAdmin/delegation-admin.resolver'
import { DelegationAdminService } from './delegationAdmin/delegation-admin.service'
import { GrantTypeResolver } from './grant-type/grant-type.resolver'
import { GrantTypeService } from './grant-type/grant-type.service'
import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'

@Module({
  imports: [AuthAdminApiClientModule, AuthDelegationApiClientModule, CmsModule],
  providers: [
    ApiScopeUserResolver,
    ApiScopeUserService,
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
    DelegationProviderService,
    DelegationProviderResolver,
    DelegationAdminResolver,
    DelegationAdminService,
    GrantTypeResolver,
    GrantTypeService,
  ],
})
export class AuthAdminModule {}
