import { Module } from '@nestjs/common'

import {
  ClientsModule as ClientsLibModule,
  ResourcesModule as ResourcesLibModule,
} from '@island.is/auth-api-lib'

import { ClientSecretsService } from './client-secrets.service'
import { MeClientSecretsController } from './me-client-secrets.controller'

@Module({
  imports: [ClientsLibModule, ResourcesLibModule],
  controllers: [MeClientSecretsController],
  providers: [ClientSecretsService],
})
export class ClientSecretsModule {}
