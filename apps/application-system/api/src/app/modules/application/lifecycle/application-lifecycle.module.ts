import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import {
  ApplicationFilesConfig,
  ApplicationFilesModule,
} from '@island.is/application/api/files'
import { signingModuleConfig } from '@island.is/dokobit-signing'
import { FileStorageConfig } from '@island.is/file-storage'
import { LoggingModule } from '@island.is/logging'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'

import { environment } from '../../../../environments'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { ApplicationChargeModule } from '../charge/application-charge.module'
import { ApplicationLifeCycleService } from './application-lifecycle.service'
import {
  UserNotificationClientConfig,
  UserNotificationEagerClientModule,
} from '@island.is/clients/user-notification'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ApplicationApiCoreModule,
    LoggingModule,
    ApplicationChargeModule,
    ApplicationFilesModule,
    UserNotificationEagerClientModule,
    AuditModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        UserNotificationClientConfig,
        signingModuleConfig,
        ApplicationFilesConfig,
        FileStorageConfig,
        AuditConfig
      ],
    }),
  ],
  providers: [ApplicationLifeCycleService],
})
export class ApplicationLifecycleModule {}
