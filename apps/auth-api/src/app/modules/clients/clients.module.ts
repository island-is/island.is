import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import { Client, ClientAllowedScope, ClientAllowedCorsOrigin, ClientPostLogoutRedirectUri, ClientRedirectUri, ClientIdpRestrictions, ClientSecret, ClientGrantType, ClientsService } from '@island.is/auth-api'
import { SequelizeModule } from '@nestjs/sequelize'

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
    ]),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule { }
