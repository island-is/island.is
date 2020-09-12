import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import { IndexingController } from './indexing.controller'
import { IndexingService } from './indexing.service'
import { ContentfulService } from './contentful.service'
import { ArticleSyncService } from '../importers/article.service' // TODO: Move this under domain
import { CmsSyncService } from './cmsSync.service' // TODO: Move this under domain

@Module({
  controllers: [IndexingController],
  providers: [IndexingService, ElasticService, ContentfulService, CmsSyncService, ArticleSyncService],
})
export class AppModule { }
