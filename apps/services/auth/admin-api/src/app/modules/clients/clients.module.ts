import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import {
  ClientsModule as AuthClientsModule,
  ResourcesModule,
  IdpProviderModule,
} from '@island.is/auth-api-lib'
import { IdpRestrictionController } from './idp-restriction.controller'
import { CorsController } from './cors.controller'
import { RedirectUriController } from './redirect-uri.controller'
import { ClientGrantTypeController } from './client-grant-type.controller'
import { ClientAllowedScopeController } from './client-allowed-scope.controller'
import { ClientClaimController } from './client-claim.controller'
import { ClientPostLogoutRedirectUriController } from './client-post-logout-redirect-uri.controller'
import { ClientSecretController } from './client-secret.controller'

@Module({
  imports: [AuthClientsModule, ResourcesModule, IdpProviderModule],
  controllers: [
    ClientsController,
    IdpRestrictionController,
    CorsController,
    RedirectUriController,
    ClientGrantTypeController,
    ClientAllowedScopeController,
    ClientClaimController,
    ClientPostLogoutRedirectUriController,
    ClientSecretController,
  ],
  providers: [],
})
export class ClientsModule {}
