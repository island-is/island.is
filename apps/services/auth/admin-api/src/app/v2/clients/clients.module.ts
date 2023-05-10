import { Module } from '@nestjs/common'

import {
  ClientsModule as ClientsLibModule,
  ResourcesModule as ResourcesLibModule,
} from '@island.is/auth-api-lib'

import { ClientSecretsService } from '../secrets/client-secrets.service'
import { MeClientsController } from './me-clients.controller'

@Module({
  imports: [ClientsLibModule, ResourcesLibModule],
  providers: [ClientSecretsService],
  controllers: [MeClientsController],
})
export class ClientsModule {}
