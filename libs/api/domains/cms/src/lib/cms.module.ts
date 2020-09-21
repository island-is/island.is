import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/api/content-search'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
} from './cms.resolver'
import { EmailService } from './cms.email.service'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'

@Module({
  providers: [
    CmsResolver,
    ArticleResolver,
    LatestNewsSliceResolver,
    ElasticService,
    EmailService,
    CmsContentfulService,
    CmsElasticsearchService,
    ContentfulRepository,
  ],
  exports: [ContentfulRepository],
})
export class CmsModule {}
