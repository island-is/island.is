import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import { AwsModule } from '@island.is/nest/aws'
import { ManagementClientConfig } from '../repositories/cms/managementClient/managementClient.config'
import { WebSitemapService } from './web-sitemap.service'
import { WebSitemapConfig } from './web-sitemap.config'
import { CmsRepositoryModule } from '../repositories/cms/cms.module'
import { FrontpageRepository } from '../repositories/web-sitemap/content-types/frontpage.repository'
import { ArticleRepository } from '../repositories/web-sitemap/content-types/article.repository'
import { OrganizationPageRepository } from '../repositories/web-sitemap/content-types/organization-page.repository'
import { OrganizationSubpageRepository } from '../repositories/web-sitemap/content-types/organization-subpage.repository'
import { OrganizationParentSubpageRepository } from '../repositories/web-sitemap/content-types/organization-parent-subpage.repository'
import { ProjectPageRepository } from '../repositories/web-sitemap/content-types/project-page.repository'
import { ManualRepository } from '../repositories/web-sitemap/content-types/manual.repository'
import { ArticleCategoryRepository } from '../repositories/web-sitemap/content-types/article-category.repository'
import { LifeEventRepository } from '../repositories/web-sitemap/content-types/life-event.repository'
import { FrontpageNewsRepository } from '../repositories/web-sitemap/content-types/frontpage-news.repository'
import { OrganizationNewsRepository } from '../repositories/web-sitemap/content-types/organization-news.repository'
import { ProjectNewsRepository } from '../repositories/web-sitemap/content-types/project-news.repository'
import { ServiceWebRepository } from '../repositories/web-sitemap/content-types/service-web.repository'
import { SupportCategoryRepository } from '../repositories/web-sitemap/content-types/support-category.repository'

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
    FrontpageRepository,
    ArticleRepository,
    OrganizationPageRepository,
    OrganizationSubpageRepository,
    OrganizationParentSubpageRepository,
    ProjectPageRepository,
    ManualRepository,
    ArticleCategoryRepository,
    LifeEventRepository,
    FrontpageNewsRepository,
    OrganizationNewsRepository,
    ProjectNewsRepository,
    ServiceWebRepository,
    SupportCategoryRepository,
  ],
})
export class WebSitemapModule {}
