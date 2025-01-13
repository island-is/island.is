import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { ElasticService } from '@island.is/content-search-toolkit'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
  FeaturedArticlesResolver,
  FeaturedEventsResolver,
  FeaturedSupportQNAsResolver,
  GrantCardsListResolver,
  PowerBiSliceResolver,
  LatestEventsSliceResolver,
  TeamListResolver,
  LatestGenericListItemsResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'
import { OrganizationLogoByNationalIdLoader } from './loaders/organizationLogoByNationalId.loader'
import { OrganizationLogoByReferenceIdLoader } from './loaders/organizationLogoByReferenceId.loader'
import { OrganizationLogoByTitleLoader } from './loaders/organizationLogoByTitle.loader'
import { OrganizationTitleByReferenceIdLoader } from './loaders/organizationTitleByKey.loader'
import { OrganizationLinkByReferenceIdLoader } from './loaders/organizationLinkByKey.loader'
import { PowerBiService } from './powerbi.service'
import { PowerBiConfig } from './powerbi.config'
import { OrganizationLinkEnByReferenceIdLoader } from './loaders/organizationLinkEnByKey.loader'
import { OrganizationTitleEnByReferenceIdLoader } from './loaders/organizationTitleEnByKey.loader'

@Module({
  imports: [HttpModule, TerminusModule, PowerBiConfig.registerOptional()],
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
    FeaturedEventsResolver,
    GrantCardsListResolver,
    FeaturedSupportQNAsResolver,
    OrganizationLogoByNationalIdLoader,
    OrganizationLogoByReferenceIdLoader,
    OrganizationLogoByTitleLoader,
    OrganizationLinkByReferenceIdLoader,
    OrganizationLinkEnByReferenceIdLoader,
    OrganizationTitleByReferenceIdLoader,
    OrganizationTitleEnByReferenceIdLoader,
    PowerBiService,
    PowerBiSliceResolver,
    LatestEventsSliceResolver,
    TeamListResolver,
    LatestGenericListItemsResolver,
  ],
  exports: [
    ContentfulRepository,
    CmsHealthIndicator,
    CmsContentfulService,
    OrganizationLogoByNationalIdLoader,
    OrganizationLogoByReferenceIdLoader,
    OrganizationLogoByTitleLoader,
    OrganizationLinkByReferenceIdLoader,
    OrganizationLinkEnByReferenceIdLoader,
    OrganizationTitleByReferenceIdLoader,
    CmsElasticsearchService,
  ],
})
export class CmsModule {}
