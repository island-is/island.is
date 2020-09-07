import { Module } from '@nestjs/common'
import { ClientsService } from './clients.service'
import { ClientsController } from './clients.controller'
import { Client } from './models/client.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './models/client-allowed-cors-origin.model'
import { ClientPostLogoutRedirectUri } from './models/client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from './models/client-redirect-uri.model'
import { ClientIdpRestrictions } from './models/client-idp-restrictions.model'
import { ClientSecret } from './models/client-secret.model'

@Module({
  imports: [SequelizeModule.forFeature([Client, ClientAllowedScope, ClientAllowedCorsOrigin, ClientPostLogoutRedirectUri, ClientRedirectUri, ClientIdpRestrictions, ClientSecret, ClientPostLogoutRedirectUri])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
