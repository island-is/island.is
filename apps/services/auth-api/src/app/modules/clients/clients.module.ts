import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import { OriginsController } from './origins.controller'
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
  IdpProvider,
  ApiScope,
  IdentityResource,
} from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'
import { ExperimentsController } from './experiments.controller'

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
      IdpProvider,
      ApiScope,
      IdentityResource,
    ]),
  ],
  controllers: [ClientsController, OriginsController, ExperimentsController],
  providers: [ClientsService],
})
export class ClientsModule {}
