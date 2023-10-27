import { Module } from '@nestjs/common'
import { ElasticService } from '@island.is/content-search-toolkit'
import { ConfigModule } from '@island.is/nest/config'
import {
  FeatureFlagConfig,
  FeatureFlagModule,
} from '@island.is/nest/feature-flags'

import { ContentfulService } from './contentful.service'
import { ArticleSyncService } from './importers/article.service'
import { CmsSyncService } from './cmsSync.service'
import { LifeEventsPageSyncService } from './importers/lifeEventsPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { AdgerdirPageSyncService } from './importers/adgerdirPage'
import { MenuSyncService } from './importers/menu.service'
import { GroupedMenuSyncService } from './importers/groupedMenu.service'
import { OrganizationPageSyncService } from './importers/organizationPage.service'
import { OrganizationSubpageSyncService } from './importers/organizationSubpage.service'
import { FrontpageSyncService } from './importers/frontpage.service'
import { SubArticleSyncService } from './importers/subArticle.service'
import { SupportQNASyncService } from './importers/supportQNA.service'
import { LinkSyncService } from './importers/link.service'
import { ProjectPageSyncService } from './importers/projectPage.service'
import { EnhancedAssetSyncService } from './importers/enhancedAsset.service'
import { VacancySyncService } from './importers/vacancy.service'
import { ServiceWebPageSyncService } from './importers/serviceWebPage.service'
import { EventSyncService } from './importers/event.service'
import { ManualSyncService } from './importers/manual.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FeatureFlagConfig],
    }),
    FeatureFlagModule,
  ],
  providers: [
    ElasticService,
    ContentfulService,
    CmsSyncService,
    ArticleSyncService,
    SubArticleSyncService,
    LifeEventsPageSyncService,
    ArticleCategorySyncService,
    NewsSyncService,
    AdgerdirPageSyncService,
    MenuSyncService,
    GroupedMenuSyncService,
    OrganizationPageSyncService,
    OrganizationSubpageSyncService,
    ProjectPageSyncService,
    FrontpageSyncService,
    SupportQNASyncService,
    LinkSyncService,
    EnhancedAssetSyncService,
    VacancySyncService,
    ServiceWebPageSyncService,
    EventSyncService,
    ManualSyncService,
  ],
  exports: [CmsSyncService],
})
export class CmsSyncModule {}
