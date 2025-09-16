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
import { AuditModule } from '@island.is/nest/audit'
import { HistoryModule } from '@island.is/application/api/history'

import { environment } from '../../../../environments'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { ApplicationChargeModule } from '../charge/application-charge.module'
import { ApplicationLifeCycleService } from './application-lifecycle.service'
import {
  UserNotificationClientConfig,
  UserNotificationEagerClientModule,
} from '@island.is/clients/user-notification'
import { PaymentsApiClientConfig } from '@island.is/clients/payments'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

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
    HistoryModule,
    AuditModule.forRoot(environment.audit),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        UserNotificationClientConfig,
        signingModuleConfig,
        ApplicationFilesConfig,
        FileStorageConfig,
        PaymentsApiClientConfig,
        FeatureFlagConfig,
      ],
    }),
  ],
  providers: [ApplicationLifeCycleService],
})
export class ApplicationLifecycleModule {}
