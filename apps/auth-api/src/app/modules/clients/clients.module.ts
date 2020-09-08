import { Module } from '@nestjs/common'
import { ClientsService } from './clients.service'
import { ClientsController } from './clients.controller'
import { Client } from './client.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClientAllowedScope } from './client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './client-allowed-cors-origin.model'
import { ClientPostLogoutRedirectUri } from './client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './client-redirect-uri.model'
import { ClientIdpRestrictions } from './client-idp-restrictions.model'
import { ClientSecret } from './client-secret.model'
import { ClientGrantType } from './client-grant-type.model'

@Module({
  imports: [SequelizeModule.forFeature([Client, ClientAllowedScope, ClientAllowedCorsOrigin, ClientPostLogoutRedirectUri, ClientRedirectUri, ClientIdpRestrictions, ClientSecret, ClientPostLogoutRedirectUri, ClientGrantType])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
