import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import {
  Client,
  ClientAllowedScope,
  ClientAllowedCorsOrigin,
  ClientPostLogoutRedirectUri,
  ClientRedirectUri,
  ClientIdpRestrictions,
  ClientSecret,
  ClientGrantType,
  ClientsService,
  ClientClaim,
  ApiScope,
  IdentityResource,
  AccessService,
  IdpProvider,
  ApiScopeUserAccess,
  ApiScopeUser,
} from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdpRestrictionController } from './idp-restriction.controller'
import { CorsController } from './cors.controller'
import { RedirectUriController } from './redirect-uri.controller'
import { ClientGrantTypeController } from './client-grant-type.controller'
import { ClientAllowedScopeController } from './client-allowed-scope.controller'
import { ClientClaimController } from './client-claim.controller'
import { ClientPostLogoutRedirectUriController } from './client-post-logout-redirect-uri.controller'
import { ClientSecretController } from './client-secret.controller'

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
