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
} from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdpRestrictionController } from './idp-restriction.controller'
import { CorsController } from './cors.controller'
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
    ]),
  ],
  controllers: [
    ClientsController,
    IdpRestrictionController,
    CorsController,
    RedirectUriController,
  ],
  providers: [ClientsService],
})
export class ClientsModule {}
