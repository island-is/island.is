import { Module } from '@nestjs/common'

import { ElasticService } from '@island.is/content-search-toolkit'

import { AdgerdirPageSyncService } from './importers/adgerdirPage'
import { ArticleSyncService } from './importers/article.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { FrontpageSyncService } from './importers/frontpage.service'
import { GroupedMenuSyncService } from './importers/groupedMenu.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { LinkSyncService } from './importers/link.service'
import { MenuSyncService } from './importers/menu.service'
import { NewsSyncService } from './importers/news.service'
import { OrganizationPageSyncService } from './importers/organizationPage.service'
import { OrganizationSubpageSyncService } from './importers/organizationSubpage.service'
import { SubArticleSyncService } from './importers/subArticle.service'
import { SupportQNASyncService } from './importers/supportQNA.service'
import { CmsSyncService } from './cmsSync.service'
import { ContentfulService } from './contentful.service'

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
