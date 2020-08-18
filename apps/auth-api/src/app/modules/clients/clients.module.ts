import { Module } from '@nestjs/common'
import { ClientsService } from './clients.service'
import { ClientsController } from './clients.controller'
import { Client } from './client.model'

@Module({
  imports: [Client],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
