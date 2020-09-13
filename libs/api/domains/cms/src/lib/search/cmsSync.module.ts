import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import { ContentfulService } from './contentful.service'
import { ArticleSyncService } from './importers/article.service'
import { CmsSyncService } from './cmsSync.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service';

@Module({
  providers: [ElasticService, ContentfulService, CmsSyncService, ArticleSyncService, LifeEventsPageSyncService],
  exports: [CmsSyncService]
})
export class CmsSyncModule { }
