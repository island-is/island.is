import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AccessService,
  ApiScope,
  ApiScopeUser,
  ApiScopeUserAccess,
  Client,
  ClientAllowedCorsOrigin,
  ClientAllowedScope,
  ClientClaim,
  ClientGrantType,
  ClientIdpRestrictions,
  ClientPostLogoutRedirectUri,
  ClientRedirectUri,
  ClientSecret,
  ClientsService,
  IdentityResource,
  IdpProvider,
} from '@island.is/auth-api-lib'

import { ClientAllowedScopeController } from './client-allowed-scope.controller'
import { ClientClaimController } from './client-claim.controller'
import { ClientGrantTypeController } from './client-grant-type.controller'
import { ClientPostLogoutRedirectUriController } from './client-post-logout-redirect-uri.controller'
import { ClientSecretController } from './client-secret.controller'
import { ClientsController } from './clients.controller'
import { CorsController } from './cors.controller'
import { IdpRestrictionController } from './idp-restriction.controller'
import { RedirectUriController } from './redirect-uri.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Client,
      ClientAllowedScope,
      ClientAllowedCorsOrigin,
      ClientPostLogoutRedirectUri,
      ClientRedirectUri,
      ClientIdpRestrictions,
      ClientSecret,
      ClientPostLogoutRedirectUri,
      ClientGrantType,
      ClientClaim,
      ApiScope,
      IdentityResource,
      IdpProvider,
      ApiScopeUserAccess,
      ApiScopeUser,
    ]),
  ],
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
  providers: [ClientsService, AccessService],
})
export class ClientsModule {}
