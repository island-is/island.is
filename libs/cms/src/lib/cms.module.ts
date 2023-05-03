import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { ElasticService } from '@island.is/content-search-toolkit'
import {
  PowerBiModule,
  PowerBiServiceProvider,
} from '@island.is/api/domains/powerbi'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
  FeaturedArticlesResolver,
  FeaturedSupportQNAsResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'
import { OrganizationLogoLoader } from './loaders/organizationLogo.loader'

@Module({
  imports: [TerminusModule, PowerBiModule],
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
    FeaturedSupportQNAsResolver,
    OrganizationLogoLoader,
    PowerBiServiceProvider,
  ],
  exports: [
    ContentfulRepository,
    CmsHealthIndicator,
    CmsContentfulService,
    OrganizationLogoLoader,
  ],
})
export class CmsModule {}
