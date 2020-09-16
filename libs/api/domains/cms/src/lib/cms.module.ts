import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import { TerminusModule } from '@nestjs/terminus'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { MailService } from './cms.mail.service'
import { CmsHealthIndicator } from './cms.health'

@Module({
  imports: [TerminusModule],
  providers: [
    CmsResolver,
    ArticleResolver,
    ElasticService,
    CmsContentfulService,
    CmsElasticsearchService,
    MailService,
    ContentfulRepository,
    CmsHealthIndicator,
    LatestNewsSliceResolver,
  ],
  exports: [ContentfulRepository, CmsHealthIndicator],
})
export class CmsModule {}
