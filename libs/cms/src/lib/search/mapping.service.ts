import { Injectable } from '@nestjs/common'

import { ArticleSyncService } from './importers/article.service'
import { SubArticleSyncService } from './importers/subArticle.service'
import { AnchorPageSyncService } from './importers/anchorPage.service'
import { LifeEventPageSyncService } from './importers/lifeEventPage.service'
import { ArticleCategorySyncService } from './importers/articleCategory.service'
import { NewsSyncService } from './importers/news.service'
import { MenuSyncService } from './importers/menu.service'
import { GroupedMenuSyncService } from './importers/groupedMenu.service'
import { OrganizationPageSyncService } from './importers/organizationPage.service'
import { OrganizationSubpageSyncService } from './importers/organizationSubpage.service'
import { FrontpageSyncService } from './importers/frontpage.service'
import { SupportQNASyncService } from './importers/supportQNA.service'
import { LinkSyncService } from './importers/link.service'
import { ProjectPageSyncService } from './importers/projectPage.service'
import { EnhancedAssetSyncService } from './importers/enhancedAsset.service'
import { VacancySyncService } from './importers/vacancy.service'
import { ServiceWebPageSyncService } from './importers/serviceWebPage.service'
import { EventSyncService } from './importers/event.service'
import { ManualSyncService } from './importers/manual.service'
import { ManualChapterItemSyncService } from './importers/manualChapterItem.service'
import { CustomPageSyncService } from './importers/customPage.service'
import { GenericListItemSyncService } from './importers/genericListItem.service'
import { TeamListSyncService } from './importers/teamList.service'
import type { CmsSyncProvider, processSyncDataInput } from './cmsSync.service'
import { GrantsSyncService } from './importers/grants.service'
import { BloodDonationRestrictionSyncService } from './importers/bloodDonationRestriction.service'
import { OrganizationParentSubpageSyncService } from './importers/organizationParentSubpage.service'

@Injectable()
export class MappingService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private contentSyncProviders: CmsSyncProvider<any>[]
  constructor(
    private readonly newsSyncService: NewsSyncService,
    private readonly articleCategorySyncService: ArticleCategorySyncService,
    private readonly articleSyncService: ArticleSyncService,
    private readonly subArticleSyncService: SubArticleSyncService,
    private readonly anchorPageSyncService: AnchorPageSyncService,
    private readonly lifeEventPageSyncService: LifeEventPageSyncService,
    private readonly menuSyncService: MenuSyncService,
    private readonly groupedMenuSyncService: GroupedMenuSyncService,
    private readonly organizationPageSyncService: OrganizationPageSyncService,
    private readonly organizationSubpageSyncService: OrganizationSubpageSyncService,
    private readonly projectPageSyncService: ProjectPageSyncService,
    private readonly frontpageSyncService: FrontpageSyncService,
    private readonly supportQNASyncService: SupportQNASyncService,
    private readonly linkSyncService: LinkSyncService,
    private readonly enhancedAssetService: EnhancedAssetSyncService,
    private readonly vacancyService: VacancySyncService,
    private readonly serviceWebPageSyncService: ServiceWebPageSyncService,
    private readonly eventSyncService: EventSyncService,
    private readonly manualSyncService: ManualSyncService,
    private readonly manualChapterItemSyncService: ManualChapterItemSyncService,
    private readonly customPageSyncService: CustomPageSyncService,
    private readonly grantSyncService: GrantsSyncService,
    private readonly genericListItemSyncService: GenericListItemSyncService,
    private readonly teamListSyncService: TeamListSyncService,
    private readonly bloodDonationRestrictionSyncService: BloodDonationRestrictionSyncService,
    private readonly organizationParentSubpageSyncService: OrganizationParentSubpageSyncService,
  ) {
    this.contentSyncProviders = [
      this.articleSyncService,
      this.subArticleSyncService,
      this.anchorPageSyncService,
      this.lifeEventPageSyncService,
      this.articleCategorySyncService,
      this.newsSyncService,
      this.menuSyncService,
      this.groupedMenuSyncService,
      this.organizationPageSyncService,
      this.organizationSubpageSyncService,
      this.projectPageSyncService,
      this.frontpageSyncService,
      this.supportQNASyncService,
      this.linkSyncService,
      this.enhancedAssetService,
      this.grantSyncService,
      this.vacancyService,
      this.serviceWebPageSyncService,
      this.eventSyncService,
      this.manualSyncService,
      this.manualChapterItemSyncService,
      this.customPageSyncService,
      this.genericListItemSyncService,
      this.teamListSyncService,
      this.bloodDonationRestrictionSyncService,
      this.organizationParentSubpageSyncService,
    ]
  }

  mapData(entries: processSyncDataInput<unknown>) {
    return this.contentSyncProviders.map((contentSyncProvider) => {
      const data = contentSyncProvider.processSyncData(entries)
      return contentSyncProvider.doMapping(data)
    })
  }
}
