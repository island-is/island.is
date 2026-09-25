import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from '../../../../platform/managementClient/managementClient.config'
import { CmsRepositoryModule } from '../../../../platform/cms.module'
import { LyfjastofnunNewsImportService } from './news.service'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [LyfjastofnunRepository, LyfjastofnunNewsImportService],
})
export class LyfjastofnunNewsImportModule {}
