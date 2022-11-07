import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { TerminusModule } from '@nestjs/terminus'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
  FeaturedArticlesResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'
import { OrganizationLogoLoader } from './loaders/organizationLogo.loader'

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
    FeaturedArticlesResolver,
    OrganizationLogoLoader,
  ],
  exports: [
    ContentfulRepository,
    CmsHealthIndicator,
    CmsContentfulService,
    OrganizationLogoLoader,
  ],
})
export class CmsModule {}
