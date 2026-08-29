import { Module } from '@nestjs/common'

import {
  ClientsModule as ClientsLibModule,
  ResourcesModule as ResourcesLibModule,
} from '@island.is/auth-api-lib'

import { ClientSecretsService } from '../secrets/client-secrets.service'
import { ClientsController } from './clients.controller'
import { MeClientsController } from './me-clients.controller'

@Module({
  imports: [ClientsLibModule, ResourcesLibModule],
  providers: [ClientSecretsService],
  controllers: [MeClientsController, ClientsController],
})
export class ClientsModule {}
