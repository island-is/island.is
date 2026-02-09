import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import { AwsModule } from '@island.is/nest/aws'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { WebSitemapService } from './web-sitemap.service'
import { WebSitemapConfig } from './web-sitemap.config'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'

@Module({
  imports: [
    LoggingModule,
    CmsRepositoryModule,
    AwsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ManagementClientConfig, WebSitemapConfig],
    }),
  ],
  providers: [WebSitemapService],
})
export class WebSitemapModule {}
