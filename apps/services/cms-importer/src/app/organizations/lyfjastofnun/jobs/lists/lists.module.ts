import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { CmsRepositoryModule } from '../../../../repositories/cms/cms.module'
import { ManagementClientConfig } from '../../../../repositories/cms/managementClient/managementClient.config'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { LyfjastofnunListsImportService } from './lists.service'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [LyfjastofnunRepository, LyfjastofnunListsImportService],
})
export class LyfjastofnunListsImportModule {}
