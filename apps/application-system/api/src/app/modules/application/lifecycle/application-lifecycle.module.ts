import { Module } from '@nestjs/common'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { LoggingModule } from '@island.is/logging'
import { ApplicationLifeCycleService } from './application-lifecycle.service'
import { ApplicationChargeModule } from '../charge/application-charge.module'
import {
  ApplicationFilesConfig,
  ApplicationFilesModule,
} from '@island.is/application/api/files'
import { ConfigModule } from '@nestjs/config'
import { signingModuleConfig } from '@island.is/dokobit-signing'
import { FileStorageConfig } from '@island.is/file-storage'

@Module({
  imports: [
    ApplicationApiCoreModule,
    LoggingModule,
    ApplicationChargeModule,
    ApplicationFilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [signingModuleConfig, ApplicationFilesConfig, FileStorageConfig],
    }),
  ],
  providers: [ApplicationLifeCycleService],
})
export class ApplicationLifecycleModule {}
