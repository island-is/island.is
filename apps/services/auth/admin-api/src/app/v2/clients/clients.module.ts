import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  Client,
  ClientsModule as ClientsLibModule,
  ResourcesModule as ResourcesLibModule,
} from '@island.is/auth-api-lib'

import { MeClientsController } from './me-clients.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([Client]),
    ClientsLibModule,
    ResourcesLibModule,
  ],
  controllers: [MeClientsController],
})
export class ClientsModule {}
