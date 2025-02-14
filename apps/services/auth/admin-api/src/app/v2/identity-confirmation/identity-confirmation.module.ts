import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'
import {
  IdentityConfirmationModule,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'

import { environment } from '../../../environments'
import { IdentityConfirmationController } from './identity-confirmation.controller'

@Module({
  imports: [
    IdentityConfirmationModule,
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
  ],
  controllers: [IdentityConfirmationController],
})
export class IdentityConfirmationApiModule {}
