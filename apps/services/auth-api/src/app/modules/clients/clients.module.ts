import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  ApiScope,
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

import { ClientsController } from './clients.controller'
import { OriginsController } from './origins.controller'

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
  controllers: [ClientsController, OriginsController],
  providers: [ClientsService],
})
export class ClientsModule {}
