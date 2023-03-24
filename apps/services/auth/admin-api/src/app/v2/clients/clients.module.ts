import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  Client,
  ClientSecret,
  ClientsModule as ClientsLibModule,
  ResourcesModule as ResourcesLibModule,
} from '@island.is/auth-api-lib'

import { ClientSecretsService } from './client-secrets.services'
import { MeClientSecretsController } from './me-client-secrets.controller'
import { MeClientsController } from './me-clients.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([ClientSecret, Client]),
    ClientsLibModule,
    ResourcesLibModule,
  ],
  controllers: [MeClientsController, MeClientSecretsController],
  providers: [ClientSecretsService],
})
export class ClientsModule {}
