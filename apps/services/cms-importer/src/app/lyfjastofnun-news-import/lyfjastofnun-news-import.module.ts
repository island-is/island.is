import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { LyfjastofnunNewsImportService } from './lyfjastofnun-news-import.service'
import { LyfjastofnunWordpressRepository } from '../repositories/lyfjastofnun-wordpress/wordpress.repository'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [LyfjastofnunWordpressRepository, LyfjastofnunNewsImportService],
})
export class LyfjastofnunNewsImportModule {}
