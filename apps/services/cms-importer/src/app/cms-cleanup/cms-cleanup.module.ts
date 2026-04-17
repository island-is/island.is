import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { CmsCleanupService } from './cms-cleanup.service'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [CmsCleanupService],
})
export class CmsCleanupModule {}
