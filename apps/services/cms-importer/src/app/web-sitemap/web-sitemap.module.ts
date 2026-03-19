import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import { AwsModule } from '@island.is/nest/aws'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { WebSitemapService } from './web-sitemap.service'
import { WebSitemapConfig } from './web-sitemap.config'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { WebSitemapRepository } from '../repositories/web-sitemap/web-sitemap.repository'
import { FrontpageRepository } from '../repositories/web-sitemap/content-types/frontpage.repository'
import { ArticleRepository } from '../repositories/web-sitemap/content-types/article.repository'
import { OrganizationPageRepository } from '../repositories/web-sitemap/content-types/organizationPage.repository'
import { OrganizationSubpageRepository } from '../repositories/web-sitemap/content-types/organizationSubpage.repository'
import { OrganizationParentSubpageRepository } from '../repositories/web-sitemap/content-types/organizationParentSubpage.repository'
import { ProjectPageRepository } from '../repositories/web-sitemap/content-types/projectPage.repository'
import { ManualRepository } from '../repositories/web-sitemap/content-types/manual.repository'
import { ArticleCategoryRepository } from '../repositories/web-sitemap/content-types/articleCategory.repository'
import { LifeEventRepository } from '../repositories/web-sitemap/content-types/lifeEvent.repository'

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
  providers: [
    WebSitemapService,
    WebSitemapRepository,
    FrontpageRepository,
    ArticleRepository,
    OrganizationPageRepository,
    OrganizationSubpageRepository,
    OrganizationParentSubpageRepository,
    ProjectPageRepository,
    ManualRepository,
    ArticleCategoryRepository,
    LifeEventRepository,
  ],
})
export class WebSitemapModule {}
