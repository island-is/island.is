import { Module } from '@nestjs/common'

import {
  ClientsModule as AuthClientsModule,
  ResourcesModule,
} from '@island.is/auth-api-lib'

import { ClientsController } from './clients.controller'

@Module({
  imports: [AuthClientsModule, ResourcesModule],
  controllers: [ClientsController],
  providers: [],
})
export class ClientsModule {}
