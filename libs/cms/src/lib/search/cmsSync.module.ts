import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { ContentfulService } from './contentful.service'
import { ArticleSyncService } from './importers/article.service'
import { CmsSyncService } from './cmsSync.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { AdgerdirPageSyncService } from './importers/adgerdirPage'
import { MenuSyncService } from './importers/menu.service'
import { GroupedMenuSyncService } from './importers/groupedMenu.service'
import { OrganizationPageSyncService } from './importers/organizationPage.service'
import { OrganizationSubpageSyncService } from './importers/organizationSubpage.service'
import { FrontpageSyncService } from './importers/frontpage.service'
import { SubArticleSyncService } from './importers/subArticle.service'
import { SupportQNASyncService } from './importers/supportQNA.service'
import { LinkSyncService } from './importers/link.service'

@Module({
  providers: [
    ElasticService,
    ContentfulService,
    CmsSyncService,
    ArticleSyncService,
    SubArticleSyncService,
    LifeEventsPageSyncService,
    ArticleCategorySyncService,
    NewsSyncService,
    AdgerdirPageSyncService,
    MenuSyncService,
    GroupedMenuSyncService,
    OrganizationPageSyncService,
    OrganizationSubpageSyncService,
    FrontpageSyncService,
    SupportQNASyncService,
    LinkSyncService,
  ],
  exports: [CmsSyncService],
})
export class CmsSyncModule {}
