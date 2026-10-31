import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { CmsRepositoryModule } from '../../../../platform/cms.module'
import { ManagementClientConfig } from '../../../../platform/managementClient/managementClient.config'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { LyfjastofnunInstructionsImportService } from './instructions.service'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [LyfjastofnunRepository, LyfjastofnunInstructionsImportService],
})
export class LyfjastofnunInstructionsImportModule {}
