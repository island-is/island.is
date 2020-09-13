import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import { ContentfulService } from './contentful.service'
import { ArticleSyncService } from './importers/article.service' // TODO: Move this under domain
import { CmsSyncService } from './cmsSync.service' // TODO: Move this under domain

@Module({
  providers: [ElasticService, ContentfulService, CmsSyncService, ArticleSyncService],
  exports: [CmsSyncService]
})
export class CmsSyncModule { }
