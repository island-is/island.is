import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { TerminusModule } from '@nestjs/terminus'
import {
  CmsResolver,
  ArticleResolver,
  LatestNewsSliceResolver,
  FeaturedArticlesResolver,
  FeaturedSupportQNAsResolver,
  PowerBiSliceResolver,
} from './cms.resolver'
import { CmsContentfulService } from './cms.contentful.service'
import { ContentfulRepository } from './contentful.repository'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { CmsHealthIndicator } from './cms.health'
import { OrganizationLogoLoader } from './loaders/organizationLogo.loader'
import { PowerBiServiceProvider } from './powerbi.service'
import { ConfigModule } from '@island.is/nest/config'
import { PowerBiConfig } from './powerbi.config'

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      load: [PowerBiConfig],
    }),
  ],
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
    PowerBiSliceResolver,
  ],
  exports: [
    ContentfulRepository,
    CmsHealthIndicator,
    CmsContentfulService,
    OrganizationLogoLoader,
  ],
})
export class CmsModule {}
