import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { ElasticService } from '@island.is/content-search-toolkit'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
  FeaturedArticlesResolver,
  FeaturedSupportQNAsResolver,
  PowerBiSliceResolver,
  OrganizationPageResolver,
  ArticleReferenceResolver,
  AuctionResolver,
  EnhancedAssetResolver,
  NewsResolver,
  SupportCategoryResolver,
  SupportQNAResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'
import { OrganizationLogoLoader } from './loaders/organizationLogo.loader'
import { PowerBiService } from './powerbi.service'
import { PowerBiConfig } from './powerbi.config'

@Module({
  imports: [TerminusModule, PowerBiConfig.registerOptional()],
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
    PowerBiService,
    PowerBiSliceResolver,
    OrganizationPageResolver,
    ArticleReferenceResolver,
    AuctionResolver,
    EnhancedAssetResolver,
    NewsResolver,
    SupportCategoryResolver,
    SupportQNAResolver,
  ],
  exports: [
    ContentfulRepository,
    CmsHealthIndicator,
    CmsContentfulService,
    OrganizationLogoLoader,
    CmsElasticsearchService,
  ],
})
export class CmsModule {}
