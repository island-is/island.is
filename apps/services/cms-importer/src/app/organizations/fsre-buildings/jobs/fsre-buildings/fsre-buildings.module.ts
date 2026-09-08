import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { CmsRepositoryModule } from '../../../../platform/cms.module'
import { ManagementClientConfig } from '../../../../platform/managementClient/managementClient.config'
import { FSREBuildingsRepository } from './fsre-buildings.repository'
import { FSREBuildingsImportService } from './fsre-buildings.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [FSREBuildingsRepository, FSREBuildingsImportService],
})
export class FSREBuildingsImportModule {}
