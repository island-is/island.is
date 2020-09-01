import { Module } from '@nestjs/common'
import { ClientsService } from './clients.service'
import { ClientsController } from './clients.controller'
import { Client } from './client.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ClientAllowedScope } from './client-allowed-scope.model'
import { ClientAllowedCorsOrigin } from './client-allowed-cors-origin.model'
import { ClientPostLogoutRedirectUri } from './client-post-logout-redirect-uri.model'

@Module({
  imports: [SequelizeModule.forFeature([Client, ClientAllowedScope, ClientAllowedCorsOrigin, ClientPostLogoutRedirectUri])],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
