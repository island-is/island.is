import { Module } from '@nestjs/common'

import {
  ClientsModule as ClientsLibModule,
  ResourcesModule as ResourcesLibModule,
} from '@island.is/auth-api-lib'

import { MeClientsController } from './me-clients.controller'

@Module({
  imports: [ClientsLibModule, ResourcesLibModule],
  controllers: [MeClientsController],
})
export class ClientsModule {}
