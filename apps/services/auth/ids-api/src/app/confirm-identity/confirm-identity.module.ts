import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule, AuditConfig } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import {
  IdentityConfirmationModule,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { ConfirmIdentityController } from './confirm-identity.controller'
import { environment } from '../../environments'
import { ConfigModule } from '@island.is/nest/config'

@Module({
  imports: [
    IdentityConfirmationModule,
    AuditModule,
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuditConfig],
    }),
  ],
  controllers: [ConfirmIdentityController],
})
export class ConfirmIdentityModule {}
