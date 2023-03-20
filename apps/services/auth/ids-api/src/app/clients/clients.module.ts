import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import { OriginsController } from './origins.controller'
import { ClientsModule as AuthClientsModule } from '@island.is/auth-api-lib'

@Module({
  imports: [AuthClientsModule],
  controllers: [ClientsController, OriginsController],
  providers: [],
})
export class ClientsModule {}
