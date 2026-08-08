import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'
import { AwsModule } from '@island.is/nest/aws'
import { ManagementClientConfig } from '../../../platform/managementClient/managementClient.config'
import { WebSitemapService } from './web-sitemap.service'
import { WebSitemapConfig } from './web-sitemap.config'
import { CmsRepositoryModule } from '../../../platform/cms.module'
import { FrontpageRepository } from './content-types/frontpage.repository'
import { ArticleRepository } from './content-types/article.repository'
import { OrganizationPageRepository } from './content-types/organization-page.repository'
import { OrganizationSubpageRepository } from './content-types/organization-subpage.repository'
import { OrganizationParentSubpageRepository } from './content-types/organization-parent-subpage.repository'
import { ProjectPageRepository } from './content-types/project-page.repository'
import { ManualRepository } from './content-types/manual.repository'
import { ArticleCategoryRepository } from './content-types/article-category.repository'
import { LifeEventRepository } from './content-types/life-event.repository'
import { FrontpageNewsRepository } from './content-types/frontpage-news.repository'
import { OrganizationNewsRepository } from './content-types/organization-news.repository'
import { ProjectNewsRepository } from './content-types/project-news.repository'
import { ServiceWebRepository } from './content-types/service-web.repository'
import { SupportCategoryRepository } from './content-types/support-category.repository'

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
