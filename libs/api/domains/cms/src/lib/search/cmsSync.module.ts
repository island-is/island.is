import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { ContentfulService } from './contentful.service'
import { ArticleSyncService } from './importers/article.service'
import { CmsSyncService } from './cmsSync.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { AboutPageSyncService } from './importers/aboutPage.service'
import { AdgerdirPageSyncService } from './importers/adgerdirPage'
import { MenuSyncService } from './importers/menu.service'
import { GroupedMenuSyncService } from './importers/groupedMenu.service'

@Module({
  providers: [
    ElasticService,
    ContentfulService,
    CmsSyncService,
    ArticleSyncService,
    LifeEventsPageSyncService,
    ArticleCategorySyncService,
    NewsSyncService,
    AboutPageSyncService,
    AdgerdirPageSyncService,
    MenuSyncService,
    GroupedMenuSyncService
  ],
  exports: [CmsSyncService],
})
export class CmsSyncModule { }
