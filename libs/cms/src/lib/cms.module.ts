import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'

import { ElasticService } from '@island.is/content-search-toolkit'

import { CmsContentfulService } from './cms.contentful.service'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'
import {
  ArticleResolver,
  CmsResolver,
  LatestNewsSliceResolver,
} from './cms.resolver'
import { ContentfulRepository } from './contentful.repository'

@Module({
  imports: [TerminusModule],
  providers: [
    CmsResolver,
    ArticleResolver,
    ElasticService,
    CmsContentfulService,
    CmsElasticsearchService,
    ContentfulRepository,
    CmsHealthIndicator,
    LatestNewsSliceResolver,
  ],
  exports: [ContentfulRepository, CmsHealthIndicator],
})
export class CmsModule {}
