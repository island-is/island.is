import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditConfig, AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import {
  IdentityConfirmationModule,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { environment } from '../../../environments'
import { IdentityConfirmationController } from './identity-confirmation.controller'
import { ConfigModule } from '@nestjs/config'

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
  controllers: [IdentityConfirmationController],
})
export class IdentityConfirmationApiModule {}
