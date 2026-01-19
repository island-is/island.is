import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { WebSitemapService } from './web-sitemap.service'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig],
    }),
  ],
  providers: [WebSitemapService],
})
export class WebSitemapModule {}
