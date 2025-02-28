import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import {
  IdentityConfirmationModule,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { ConfirmIdentityController } from './confirm-identity.controller'
import { environment } from '../../environments'

@Module({
  imports: [
    IdentityConfirmationModule,
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
  ],
  controllers: [ConfirmIdentityController],
})
export class ConfirmIdentityModule {}
