import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { LyfjastofnunListsRepository } from '../repositories/lyfjastofnun-lists/lyfjastofnun-lists.repository'
import { LyfjastofnunListsImportService } from './lyfjastofnun-lists-import.service'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [LyfjastofnunListsRepository, LyfjastofnunListsImportService],
})
export class LyfjastofnunListsImportModule {}
