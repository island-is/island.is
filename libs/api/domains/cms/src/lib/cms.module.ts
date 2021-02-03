import { Module } from '@nestjs/common'
import { RedisCacheModule } from './redis-cache.module'
import { ElasticService } from '@island.is/content-search-toolkit'
import { TerminusModule } from '@nestjs/terminus'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
  AboutSubPageResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'

@Module({
  imports: [TerminusModule, RedisCacheModule],
  providers: [
    CmsResolver,
    ArticleResolver,
    ElasticService,
    CmsContentfulService,
    CmsElasticsearchService,
    ContentfulRepository,
    CmsHealthIndicator,
    LatestNewsSliceResolver,
    AboutSubPageResolver,
  ],
  exports: [ContentfulRepository, CmsHealthIndicator],
})
export class CmsModule {}
