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
  AdminAccess,
  IdpRestriction,
  IdpProviderService,
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
import { IdpProviderController } from './idp-provider.controller'

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
      IdpRestriction,
      AdminAccess,
      IdpProviderService,
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
    IdpProviderController,
  ],
  providers: [ClientsService, AccessService],
})
export class ClientsModule {}
