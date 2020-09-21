import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import { ContentfulService } from './contentful.service'
import { ArticleSyncService } from './importers/article.service'
import { CmsSyncService } from './cmsSync.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { AboutPageSyncService } from './importers/aboutPage.service'

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
  ],
  exports: [CmsSyncService],
})
export class CmsSyncModule {}
