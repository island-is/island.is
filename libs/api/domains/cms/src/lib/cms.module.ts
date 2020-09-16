import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
} from './cms.resolver'
import { CmsService } from './cms.service'
import { ContentfulRepository } from './contentful.repository'

@Module({
  providers: [
    CmsResolver,
    ArticleResolver,
    LatestNewsSliceResolver,
    ElasticService,
    CmsService,
    ContentfulRepository,
  ],
  exports: [ContentfulRepository],
})
export class CmsModule {}
