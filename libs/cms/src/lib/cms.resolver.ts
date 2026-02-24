import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import {
  Args,
  Query,
  Resolver,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql'
import { Article } from './models/article.model'
import { ContentSlug } from './models/contentSlug.model'
import { Organization } from './models/organization.model'
import { Organizations } from './models/organizations.model'
import { News } from './models/news.model'
import { GetSingleNewsInput } from './dto/getSingleNews.input'
import { GetOrganizationTagsInput } from './dto/getOrganizationTags.input'
import { GetOrganizationsInput } from './dto/getOrganizations.input'
import { GetOrganizationInput } from './dto/getOrganization.input'
import { GetErrorPageInput } from './dto/getErrorPage.input'
import { Namespace } from './models/namespace.model'
import { AlertBanner } from './models/alertBanner.model'
import { GenericPage } from './models/genericPage.model'
import { GenericOverviewPage } from './models/genericOverviewPage.model'
import { GetNamespaceInput } from './dto/getNamespace.input'
import { GetAlertBannerInput } from './dto/getAlertBanner.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { GetGenericOverviewPageInput } from './dto/getGenericOverviewPage.input'
import { GetAnchorPageInput } from './dto/getAnchorPage.input'
import { GetAnchorPagesInput } from './dto/getAnchorPages.input'
import { Menu } from './models/menu.model'
import { GetMenuInput } from './dto/getMenu.input'
import { AnchorPage } from './models/anchorPage.model'
import { OrganizationTags } from './models/organizationTags.model'
import { CmsContentfulService } from './cms.contentful.service'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { PowerBiService } from './powerbi.service'
import { ArticleCategory } from './models/articleCategory.model'
import { GetArticleCategoriesInput } from './dto/getArticleCategories.input'
import { GetArticlesInput } from './dto/getArticles.input'
import { GetContentSlugInput } from './dto/getContentSlug.input'
import { GetUrlInput } from './dto/getUrl.input'
import { Url } from './models/url.model'
import { GetSingleArticleInput } from './dto/getSingleArticle.input'
import { LatestNewsSlice } from './models/latestNewsSlice.model'
import { GetNewsInput } from './dto/getNews.input'
import { GetNewsDatesInput } from './dto/getNewsDates.input'
import { NewsList } from './models/newsList.model'
import { GroupedMenu } from './models/groupedMenu.model'
import { GetSingleMenuInput } from './dto/getSingleMenu.input'
import { SubpageHeader } from './models/subpageHeader.model'
import { GetSubpageHeaderInput } from './dto/getSubpageHeader.input'
import { ErrorPage } from './models/errorPage.model'
import { OrganizationSubpage } from './models/organizationSubpage.model'
import {
  GetOrganizationSubpageByIdInput,
  GetOrganizationSubpageInput,
} from './dto/getOrganizationSubpage.input'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'
import { OrganizationPage } from './models/organizationPage.model'
import { GetOrganizationPageInput } from './dto/getOrganizationPage.input'
import { GetAuctionsInput } from './dto/getAuctions.input'
import { Auction } from './models/auction.model'
import { GetAuctionInput } from './dto/getAuction.input'
import { Frontpage } from './models/frontpage.model'
import { GetFrontpageInput } from './dto/getFrontpage.input'
import { OpenDataPage } from './models/openDataPage.model'
import { GetOpenDataPageInput } from './dto/getOpenDataPage.input'
import { OpenDataSubpage } from './models/openDataSubpage.model'
import { GetOpenDataSubpageInput } from './dto/getOpenDataSubpage.input'
import { ProjectPage } from './models/projectPage.model'
import { GetProjectPageInput } from './dto/getProjectPage.input'
import { SupportQNA } from './models/supportQNA.model'
import { GetSupportQNAsInput } from './dto/getSupportQNAs.input'
import { SupportCategory } from './models/supportCategory.model'
import { GetSupportCategoryInput } from './dto/getSupportCategory.input'
import { GetSupportQNAsInCategoryInput } from './dto/getSupportQNAsInCategory.input'
import { GetSupportCategoriesInput } from './dto/getSupportCategories.input'
import { GetSupportCategoriesInOrganizationInput } from './dto/getSupportCategoriesInOrganization.input'
import { GetPublishedMaterialInput } from './dto/getPublishedMaterial.input'
import { EnhancedAssetSearchResult } from './models/enhancedAssetSearchResult.model'
import { GetSingleSupportQNAInput } from './dto/getSingleSupportQNA.input'
import { GetFeaturedSupportQNAsInput } from './dto/getFeaturedSupportQNAs.input'
import { Locale } from '@island.is/shared/types'
import { FeaturedArticles } from './models/featuredArticles.model'
import { GetServicePortalAlertBannersInput } from './dto/getServicePortalAlertBanners.input'
import { GetTabSectionInput } from './dto/getTabSection.input'
import { TabSection } from './models/tabSection.model'
import { GenericTag } from './models/genericTag.model'
import { GetGenericTagBySlugInput } from './dto/getGenericTagBySlug.input'
import { FeaturedSupportQNAs } from './models/featuredSupportQNAs.model'
import { PowerBiSlice } from './models/powerBiSlice.model'
import { GetPowerBiEmbedPropsFromServerResponse } from './dto/getPowerBiEmbedPropsFromServer.response'
import { GetOrganizationByTitleInput } from './dto/getOrganizationByTitle.input'
import { ServiceWebPage } from './models/serviceWebPage.model'
import { GetServiceWebPageInput } from './dto/getServiceWebPage.input'
import { GetServicePortalPageInput } from './dto/getServicePortalPage.input'
import { LatestEventsSlice } from './models/latestEventsSlice.model'
import { Event as EventModel } from './models/event.model'
import { GetSingleEventInput } from './dto/getSingleEvent.input'
import { GetEventsInput } from './dto/getEvents.input'
import { EventList } from './models/eventList.model'
import { Manual } from './models/manual.model'
import { GetSingleManualInput } from './dto/getSingleManual.input'
import { GetSingleEntryTitleByIdInput } from './dto/getSingleEntryTitleById.input'
import { EntryTitle } from './models/entryTitle.model'
import { LifeEventPage } from './models/lifeEventPage.model'
import { GetLifeEventPageInput } from './dto/getLifeEventPage.input'
import { GetLifeEventsInput } from './dto/getLifeEvents.input'
import { GetLifeEventsInCategoryInput } from './dto/getLifeEventsInCategory.input'
import { CategoryPage } from './models/categoryPage.model'
import { GetCategoryPagesInput } from './dto/getCategoryPages.input'
import { FeaturedEvents } from './models/featuredEvents.model'
import { GraphQLJSONObject } from 'graphql-type-json'
import { CustomPage } from './models/customPage.model'
import { GetCustomPageInput } from './dto/getCustomPage.input'
import { GenericListItemResponse } from './models/genericListItemResponse.model'
import { GetGenericListItemsInput } from './dto/getGenericListItems.input'
import { GetCustomSubpageInput } from './dto/getCustomSubpage.input'
import { GetGenericListItemBySlugInput } from './dto/getGenericListItemBySlug.input'
import { GenericListItem } from './models/genericListItem.model'
import { GetTeamMembersInput } from './dto/getTeamMembers.input'
import { TeamMemberResponse } from './models/teamMemberResponse.model'
import { TeamList } from './models/teamList.model'
import { TeamMember } from './models/teamMember.model'
import { LatestGenericListItems } from './models/latestGenericListItems.model'
import { GetGenericTagsInTagGroupsInput } from './dto/getGenericTagsInTagGroups.input'
import { Grant } from './models/grant.model'
import { GetGrantsInput } from './dto/getGrants.input'
import { GetSingleGrantInput } from './dto/getSingleGrant.input'
import { GrantList } from './models/grantList.model'
import { OrganizationParentSubpage } from './models/organizationParentSubpage.model'
import { GetOrganizationParentSubpageInput } from './dto/getOrganizationParentSubpage.input'
import {
  OrganizationPageStandaloneSitemap,
  OrganizationPageStandaloneSitemapLevel2,
} from './models/organizationPageStandaloneSitemap.model'
import {
  GetOrganizationPageStandaloneSitemapLevel1Input,
  GetOrganizationPageStandaloneSitemapLevel2Input,
} from './dto/getOrganizationPageStandaloneSitemap.input'
import { GetOrganizationByNationalIdInput } from './dto/getOrganizationByNationalId.input'
import { GrantCardsList } from './models/grantCardsList.model'
import { sortAlpha } from '@island.is/shared/utils'
import { GetTeamMembersInputOrderBy } from './dto/getTeamMembers.input'
import { IntroLinkImage } from './models/introLinkImage.model'
import {
  GetBloodDonationRestrictionDetailsInput,
  GetBloodDonationRestrictionGenericTagsInput,
  GetBloodDonationRestrictionsInput,
} from './dto/getBloodDonationRestrictions.input'
import {
  BloodDonationRestrictionDetails,
  BloodDonationRestrictionGenericTagList,
  BloodDonationRestrictionList,
} from './models/bloodDonationRestriction.model'
import { GenericList } from './models/genericList.model'
import { FeaturedGenericListItems } from './models/featuredGenericListItems.model'
import {
  CourseCategoriesResponse,
  CourseDetails,
  CourseList,
  CourseSelectOptionsResponse,
} from './models/course.model'
import {
  GetCourseCategoriesInput,
  GetCoursesInput,
} from './dto/getCourses.input'
import { GetCourseByIdInput } from './dto/getCourseById.input'
import { GetCourseListPageByIdInput } from './dto/getCourseListPageById.input'
import { CourseListPage } from './models/courseListPage.model'
import { GetCourseSelectOptionsInput } from './dto/getCourseSelectOptions.input'
import { WebChat } from './models/webChat.model'
import { GetWebChatInput } from './dto/getWebChat.input'
import { ServicePortalPage } from './models/servicePortalPage.model'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class CmsResolver {
  constructor(
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly cmsElasticsearchService: CmsElasticsearchService,
  ) {}

  @CacheControl(defaultCache)
  @Query(() => Namespace, { nullable: true })
  getNamespace(
    @Args('input') input: GetNamespaceInput,
  ): Promise<Namespace | null> {
    return this.cmsContentfulService.getNamespace(
      input?.namespace ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  // TODO: Change this so this won't link to non existing entries e.g. articles
  @CacheControl(defaultCache)
  @Query(() => ContentSlug, { nullable: true })
  getContentSlug(
    @Args('input') input: GetContentSlugInput,
  ): Promise<ContentSlug | null> {
    return this.cmsContentfulService.getContentSlug(input)
  }

  @CacheControl({ maxAge: 10 })
  @Query(() => AlertBanner, { nullable: true })
  getAlertBanner(
    @Args('input') input: GetAlertBannerInput,
  ): Promise<AlertBanner | null> {
    return this.cmsContentfulService.getAlertBanner(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [AlertBanner], { nullable: true })
  getServicePortalAlertBanners(
    @Args('input') input: GetServicePortalAlertBannersInput,
  ): Promise<AlertBanner[] | null> {
    return this.cmsContentfulService.getServicePortalAlertBanners(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericPage, { nullable: true })
  getGenericPage(
    @Args('input') input: GetGenericPageInput,
  ): Promise<GenericPage | null> {
    return this.cmsContentfulService.getGenericPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericOverviewPage, { nullable: true })
  getGenericOverviewPage(
    @Args('input') input: GetGenericOverviewPageInput,
  ): Promise<GenericOverviewPage | null> {
    return this.cmsContentfulService.getGenericOverviewPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => ErrorPage, { nullable: true })
  getErrorPage(
    @Args('input') input: GetErrorPageInput,
  ): Promise<ErrorPage | null> {
    return this.cmsContentfulService.getErrorPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => OpenDataPage)
  getOpenDataPage(
    @Args('input') input: GetOpenDataPageInput,
  ): Promise<OpenDataPage | null> {
    return this.cmsContentfulService.getOpenDataPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => OpenDataSubpage)
  getOpenDataSubpage(
    @Args('input') input: GetOpenDataSubpageInput,
  ): Promise<OpenDataSubpage | null> {
    return this.cmsContentfulService.getOpenDataSubpage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => Organization, { nullable: true })
  async getOrganization(
    @Args('input') input: GetOrganizationInput,
  ): Promise<Organization | null> {
    const slug = input?.slug ?? ''
    return this.cmsContentfulService.getOrganization(
      slug,
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Organization, { nullable: true })
  getOrganizationByTitle(
    @Args('input') input: GetOrganizationByTitleInput,
  ): Promise<Organization | null> {
    return this.cmsContentfulService.getOrganizationByTitle(
      input?.title ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Organization, { nullable: true })
  getOrganizationByNationalId(
    @Args('input') input: GetOrganizationByNationalIdInput,
  ): Promise<Organization | null> {
    return this.cmsContentfulService.getOrganizationByNationalId(
      input?.nationalId ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationPage, { nullable: true })
  async getOrganizationPage(
    @Args('input') input: GetOrganizationPageInput,
  ): Promise<OrganizationPage | null> {
    const organizationPage =
      await this.cmsContentfulService.getOrganizationPage(
        input.slug,
        input.lang,
      )

    if (!organizationPage) {
      return organizationPage
    }

    // Used in the resolver to fetch navigation links from cms
    organizationPage.subpageSlugsInput = input.subpageSlugs
    organizationPage.lang = input.lang

    return organizationPage
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationSubpage, { nullable: true })
  async getOrganizationSubpage(
    @Args('input') input: GetOrganizationSubpageInput,
  ): Promise<OrganizationSubpage | null> {
    return this.cmsContentfulService.getOrganizationSubpage(
      input.organizationSlug,
      input.slug,
      input.lang,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationSubpage, { nullable: true })
  async getOrganizationSubpageById(
    @Args('input') input: GetOrganizationSubpageByIdInput,
  ): Promise<OrganizationSubpage | null> {
    return this.cmsContentfulService.getOrganizationSubpageById(
      input.id,
      input.lang,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => ServiceWebPage, { nullable: true })
  async getServiceWebPage(
    @Args('input') input: GetServiceWebPageInput,
  ): Promise<ServiceWebPage | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
      getElasticsearchIndex(input.lang),
      { type: 'webServiceWebPage', slug: input.slug },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => ServicePortalPage, { nullable: true })
  async getServicePortalPage(
    @Args('input') input: GetServicePortalPageInput,
  ): Promise<ServicePortalPage | null> {
    return this.cmsContentfulService.getServicePortalPage(
      input.slug,
      input.lang,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [Auction])
  getAuctions(
    @Args('input') input: GetAuctionsInput,
  ): Promise<Auction[] | null> {
    return this.cmsContentfulService.getAuctions(
      input.lang,
      input.organization,
      input.year,
      input.month,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Auction)
  getAuction(@Args('input') input: GetAuctionInput): Promise<Auction | null> {
    return this.cmsContentfulService.getAuction(input.id, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => ProjectPage, { nullable: true })
  getProjectPage(
    @Args('input') input: GetProjectPageInput,
  ): Promise<ProjectPage | null> {
    return this.cmsContentfulService.getProjectPage(input.slug, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => Organizations)
  getOrganizations(
    @Args('input', { nullable: true }) input: GetOrganizationsInput,
  ): Promise<Organizations> {
    return this.cmsContentfulService.getOrganizations(input)
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationTags, { nullable: true })
  getOrganizationTags(
    @Args('input') input: GetOrganizationTagsInput,
  ): Promise<OrganizationTags | null> {
    return this.cmsContentfulService.getOrganizationTags(input?.lang ?? 'is-IS')
  }

  @CacheControl(defaultCache)
  @Query(() => AnchorPage, { nullable: true })
  getAnchorPage(
    @Args('input') input: GetAnchorPageInput,
  ): Promise<AnchorPage | null> {
    return this.cmsContentfulService.getAnchorPage(input.slug, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => [AnchorPage])
  getAnchorPages(
    @Args('input') input: GetAnchorPagesInput,
  ): Promise<AnchorPage[]> {
    return this.cmsContentfulService.getAnchorPages(input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => LifeEventPage, { nullable: true })
  getLifeEventPage(
    @Args('input') input: GetLifeEventPageInput,
  ): Promise<LifeEventPage | null> {
    return this.cmsContentfulService.getLifeEventPage(input.slug, input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => [LifeEventPage])
  getLifeEventsForOverview(
    @Args('input') input: GetLifeEventsInput,
  ): Promise<LifeEventPage[]> {
    return this.cmsContentfulService.getLifeEventsForOverview(input.lang)
  }

  @CacheControl(defaultCache)
  @Query(() => [LifeEventPage])
  getLifeEventsInCategory(
    @Args('input') input: GetLifeEventsInCategoryInput,
  ): Promise<LifeEventPage[]> {
    return this.cmsContentfulService.getLifeEventsInCategory(
      input.lang,
      input.slug,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Url, { nullable: true })
  getUrl(@Args('input') input: GetUrlInput): Promise<Url | null> {
    return this.cmsContentfulService.getUrl(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Frontpage, { nullable: true })
  getFrontpage(
    @Args('input') input: GetFrontpageInput,
  ): Promise<Frontpage | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
      getElasticsearchIndex(input.lang),
      { type: 'webFrontpage', slug: input.pageIdentifier },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [ArticleCategory])
  getArticleCategories(
    @Args('input') input: GetArticleCategoriesInput,
  ): Promise<ArticleCategory[]> {
    return this.cmsElasticsearchService.getArticleCategories(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Article, { nullable: true })
  async getSingleArticle(
    @Args('input') { lang, slug }: GetSingleArticleInput,
  ): Promise<(Partial<Article> & { lang: Locale }) | null> {
    const article: Article | null = await this.cmsContentfulService.getArticle(
      slug,
      lang,
    )

    if (!article) return null

    return {
      ...article,
      lang,
    }
  }

  @CacheControl(defaultCache)
  @Query(() => [Article])
  async getArticles(
    @Args('input') input: GetArticlesInput,
  ): Promise<Article[]> {
    return this.cmsElasticsearchService.getArticles(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => GrantList)
  async getGrants(@Args('input') input: GetGrantsInput): Promise<GrantList> {
    return this.cmsElasticsearchService.getGrants(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Grant, { nullable: true })
  async getSingleGrant(
    @Args('input') { lang, id }: GetSingleGrantInput,
  ): Promise<Grant | null> {
    return this.cmsContentfulService.getGrant(lang, id)
  }

  @CacheControl(defaultCache)
  @Query(() => News, { nullable: true })
  getSingleNews(
    @Args('input') { lang, slug }: GetSingleNewsInput,
  ): Promise<News | null> {
    return this.cmsContentfulService.getSingleNewsItem(lang, slug)
  }

  @CacheControl(defaultCache)
  @Query(() => EventModel, { nullable: true })
  getSingleEvent(
    @Args('input') { lang, slug }: GetSingleEventInput,
  ): Promise<EventModel | null> {
    return this.cmsContentfulService.getSingleEvent(lang, slug)
  }

  @CacheControl(defaultCache)
  @Query(() => EventList)
  async getEvents(@Args('input') input: GetEventsInput): Promise<EventList> {
    return this.cmsElasticsearchService.getEvents(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [String])
  async getNewsDates(
    @Args('input') input: GetNewsDatesInput,
  ): Promise<string[]> {
    return this.cmsElasticsearchService.getNewsDates(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => NewsList)
  async getNews(@Args('input') input: GetNewsInput): Promise<NewsList> {
    // When not filtering, fetch directly from CMS to avoid Elasticsearch's maximum result window size limit (10,000 items)
    if (!input.year && !input.month && !input.tags?.length) {
      return this.cmsContentfulService.getNews(input)
    }
    return this.cmsElasticsearchService.getNews(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => Menu, { nullable: true })
  getMenu(@Args('input') input: GetMenuInput): Promise<Menu | null> {
    return this.cmsElasticsearchService.getSingleMenuByName(
      getElasticsearchIndex(input.lang),
      { ...input },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => GroupedMenu, { nullable: true })
  getGroupedMenu(
    @Args('input') input: GetSingleMenuInput,
  ): Promise<GroupedMenu | null> {
    return this.cmsElasticsearchService.getSingleMenu<GroupedMenu>(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => SubpageHeader, { nullable: true })
  getSubpageHeader(
    @Args('input') input: GetSubpageHeaderInput,
  ): Promise<SubpageHeader | null> {
    return this.cmsContentfulService.getSubpageHeader(input)
  }

  @CacheControl(defaultCache)
  @Query(() => SupportQNA, { nullable: true })
  getSingleSupportQNA(
    @Args('input') { lang, slug }: GetSingleSupportQNAInput,
  ): Promise<SupportQNA | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug<SupportQNA>(
      getElasticsearchIndex(lang),
      { type: 'webQNA', slug },
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportQNA])
  async getFeaturedSupportQNAs(
    @Args('input') input: GetFeaturedSupportQNAsInput,
  ): Promise<SupportQNA[]> {
    return this.cmsElasticsearchService.getFeaturedSupportQNAs(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportQNA])
  getSupportQNAs(
    @Args('input') input: GetSupportQNAsInput,
  ): Promise<SupportQNA[]> {
    return this.cmsContentfulService.getSupportQNAs(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportQNA])
  getSupportQNAsInCategory(
    @Args('input') input: GetSupportQNAsInCategoryInput,
  ): Promise<SupportQNA[]> {
    return this.cmsContentfulService.getSupportQNAsInCategory(input)
  }

  @CacheControl(defaultCache)
  @Query(() => SupportCategory, { nullable: true })
  getSupportCategory(
    @Args('input') input: GetSupportCategoryInput,
  ): Promise<SupportCategory | null> {
    return this.cmsContentfulService.getSupportCategory(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportCategory])
  getSupportCategories(
    @Args('input') input: GetSupportCategoriesInput,
  ): Promise<SupportCategory[]> {
    return this.cmsContentfulService.getSupportCategories(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [SupportCategory])
  async getSupportCategoriesInOrganization(
    @Args('input') input: GetSupportCategoriesInOrganizationInput,
  ): Promise<SupportCategory[]> {
    return this.cmsContentfulService.getSupportCategoriesInOrganization(input)
  }

  @CacheControl(defaultCache)
  @Query(() => EnhancedAssetSearchResult)
  async getPublishedMaterial(
    @Args('input') input: GetPublishedMaterialInput,
  ): Promise<EnhancedAssetSearchResult> {
    return this.cmsElasticsearchService.getPublishedMaterial(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => TabSection, { nullable: true })
  getTabSection(
    @Args('input') input: GetTabSectionInput,
  ): Promise<TabSection | null> {
    return this.cmsContentfulService.getTabSection(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericTag, { nullable: true })
  getGenericTagBySlug(
    @Args('input') input: GetGenericTagBySlugInput,
  ): Promise<GenericTag | null> {
    return this.cmsContentfulService.getGenericTagBySlug(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [GenericTag], { nullable: true })
  getGenericTagsInTagGroups(
    @Args('input') input: GetGenericTagsInTagGroupsInput,
  ): Promise<Array<GenericTag> | null> {
    return this.cmsContentfulService.getGenericTagsInTagGroups(input)
  }

  @CacheControl(defaultCache)
  @Query(() => Manual, { nullable: true })
  getSingleManual(
    @Args('input') input: GetSingleManualInput,
  ): Promise<Manual | null> {
    return this.cmsContentfulService.getSingleManual(input.lang, input.slug)
  }

  @CacheControl(defaultCache)
  @Query(() => [CategoryPage], { nullable: true })
  async getCategoryPages(
    @Args('input') input: GetCategoryPagesInput,
  ): Promise<typeof CategoryPage[] | null> {
    return this.cmsElasticsearchService.getCategoryPages(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => EntryTitle, { nullable: true })
  async getSingleEntryTitleById(
    @Args('input') input: GetSingleEntryTitleByIdInput,
  ): Promise<EntryTitle | null> {
    const document = await this.cmsElasticsearchService.getSingleDocumentById(
      getElasticsearchIndex(input.lang),
      input.id,
    )
    if (typeof document?.title !== 'string') return null
    return { title: document.title }
  }

  @CacheControl(defaultCache)
  @Query(() => CustomPage, { nullable: true })
  async getCustomPage(
    @Args('input') input: GetCustomPageInput,
  ): Promise<CustomPage | null> {
    return this.cmsElasticsearchService.getCustomPage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => CustomPage, { nullable: true })
  async getCustomSubpage(
    @Args('input') input: GetCustomSubpageInput,
  ): Promise<CustomPage | null> {
    return this.cmsElasticsearchService.getCustomSubpage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericListItemResponse, { nullable: true })
  getGenericListItems(
    @Args('input') input: GetGenericListItemsInput,
  ): Promise<GenericListItemResponse> {
    return this.cmsElasticsearchService.getGenericListItems(input)
  }

  @CacheControl(defaultCache)
  @Query(() => GenericListItem, { nullable: true })
  getGenericListItemBySlug(
    @Args('input') input: GetGenericListItemBySlugInput,
  ): Promise<GenericListItem | null> {
    return this.cmsElasticsearchService.getGenericListItemBySlug(input)
  }

  @CacheControl(defaultCache)
  @Query(() => TeamMemberResponse, { nullable: true })
  getTeamMembers(
    @Args('input') input: GetTeamMembersInput,
  ): Promise<TeamMemberResponse> {
    return this.cmsElasticsearchService.getTeamMembers(input)
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationParentSubpage, { nullable: true })
  getOrganizationParentSubpage(
    @Args('input') input: GetOrganizationParentSubpageInput,
  ): Promise<OrganizationParentSubpage | null> {
    return this.cmsContentfulService.getOrganizationParentSubpage(input)
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationPageStandaloneSitemap, { nullable: true })
  getOrganizationPageStandaloneSitemapLevel1(
    @Args('input') input: GetOrganizationPageStandaloneSitemapLevel1Input,
  ): Promise<OrganizationPageStandaloneSitemap | null> {
    return this.cmsContentfulService.getOrganizationPageStandaloneSitemapLevel1(
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => OrganizationPageStandaloneSitemapLevel2, { nullable: true })
  getOrganizationPageStandaloneSitemapLevel2(
    @Args('input') input: GetOrganizationPageStandaloneSitemapLevel2Input,
  ): Promise<OrganizationPageStandaloneSitemapLevel2 | null> {
    return this.cmsContentfulService.getOrganizationPageStandaloneSitemapLevel2(
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => BloodDonationRestrictionGenericTagList)
  getBloodDonationRestrictionGenericTags(
    @Args('input') input: GetBloodDonationRestrictionGenericTagsInput,
  ): Promise<BloodDonationRestrictionGenericTagList> {
    return this.cmsElasticsearchService.getBloodDonationRestrictionGenericTags(
      getElasticsearchIndex(input.lang),
    )
  }

  @CacheControl(defaultCache)
  @Query(() => BloodDonationRestrictionList)
  getBloodDonationRestrictions(
    @Args('input') input: GetBloodDonationRestrictionsInput,
  ): Promise<BloodDonationRestrictionList> {
    return this.cmsElasticsearchService.getBloodDonationRestrictionList(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => BloodDonationRestrictionDetails, { nullable: true })
  getBloodDonationRestrictionDetails(
    @Args('input') input: GetBloodDonationRestrictionDetailsInput,
  ): Promise<BloodDonationRestrictionDetails | null> {
    return this.cmsContentfulService.getBloodDonationRestrictionDetails(input)
  }

  @CacheControl(defaultCache)
  @Query(() => CourseList, { nullable: true })
  getCourses(@Args('input') input: GetCoursesInput): Promise<CourseList> {
    return this.cmsElasticsearchService.getCourseList(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => CourseCategoriesResponse)
  getCourseCategories(
    @Args('input') input: GetCourseCategoriesInput,
  ): Promise<CourseCategoriesResponse> {
    return this.cmsElasticsearchService.getCourseCategories(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @CacheControl(defaultCache)
  @Query(() => CourseDetails, { nullable: true })
  getCourseById(
    @Args('input') input: GetCourseByIdInput,
  ): Promise<CourseDetails | null> {
    return this.cmsContentfulService.getCourseById(input)
  }

  @CacheControl(defaultCache)
  @Query(() => CourseListPage, { nullable: true })
  getCourseListPageById(
    @Args('input') input: GetCourseListPageByIdInput,
  ): Promise<CourseListPage | null> {
    return this.cmsContentfulService.getCourseListPageById(input)
  }

  @CacheControl(defaultCache)
  @Query(() => CourseSelectOptionsResponse)
  getCourseSelectOptions(
    @Args('input') input: GetCourseSelectOptionsInput,
  ): Promise<CourseSelectOptionsResponse> {
    return this.cmsContentfulService.getCourseSelectOptions(input)
  }

  @CacheControl(defaultCache)
  @Query(() => WebChat, { nullable: true })
  getWebChat(@Args('input') input: GetWebChatInput): Promise<WebChat | null> {
    return this.cmsContentfulService.getWebChat(input)
  }
}

@Resolver(() => LatestNewsSlice)
@CacheControl(defaultCache)
export class LatestNewsSliceResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @CacheControl(defaultCache)
  @ResolveField(() => [News])
  async news(@Parent() { news: input }: LatestNewsSlice): Promise<News[]> {
    const newsList = await this.cmsElasticsearchService.getNews(
      getElasticsearchIndex(input.lang),
      input,
    )
    return newsList.items
  }
}

@Resolver(() => LatestEventsSlice)
@CacheControl(defaultCache)
export class LatestEventsSliceResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @CacheControl(defaultCache)
  @ResolveField(() => [EventModel])
  async events(
    @Parent() { events: input }: LatestEventsSlice,
  ): Promise<EventModel[]> {
    const eventsList = await this.cmsElasticsearchService.getEvents(
      getElasticsearchIndex(input.lang),
      input,
    )

    return eventsList.items
  }
}

@Resolver(() => Article)
@CacheControl(defaultCache)
export class ArticleResolver {
  constructor(private cmsContentfulService: CmsContentfulService) {}

  @CacheControl(defaultCache)
  @ResolveField(() => [Article])
  async relatedArticles(
    @Parent() article: (Article & { lang?: Locale }) | null,
  ): Promise<Article[]> {
    if (!article) return []

    return this.cmsContentfulService.getRelatedArticles(
      article.slug,
      article?.lang ?? 'is',
    )
  }
}

@Resolver(() => FeaturedArticles)
@CacheControl(defaultCache)
export class FeaturedArticlesResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @ResolveField(() => [Article])
  async resolvedArticles(
    @Parent() { resolvedArticles: input }: FeaturedArticles,
  ): Promise<Article[]> {
    if (input.size === 0) {
      return []
    }
    return this.cmsElasticsearchService.getArticles(
      getElasticsearchIndex(input.lang),
      input,
    )
  }
}

@Resolver(() => FeaturedSupportQNAs)
@CacheControl(defaultCache)
export class FeaturedSupportQNAsResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @ResolveField(() => [SupportQNA])
  async resolvedSupportQNAs(
    @Parent() { resolvedSupportQNAs: input }: FeaturedSupportQNAs,
  ): Promise<SupportQNA[]> {
    if (input.size === 0) {
      return []
    }
    return this.cmsElasticsearchService.getFeaturedSupportQNAs(
      getElasticsearchIndex(input.lang),
      input,
    )
  }
}

@Resolver(() => PowerBiSlice)
export class PowerBiSliceResolver {
  constructor(private powerBiService: PowerBiService) {}

  @ResolveField(() => GetPowerBiEmbedPropsFromServerResponse, {
    nullable: true,
  })
  async powerBiEmbedPropsFromServer(@Parent() powerBiSlice: PowerBiSlice) {
    return this.powerBiService.getEmbedProps(powerBiSlice)
  }
}

@Resolver(() => GrantCardsList)
@CacheControl(defaultCache)
export class GrantCardsListResolver {
  constructor(
    private cmsElasticsearchService: CmsElasticsearchService,
    private cmsContentfulService: CmsContentfulService,
  ) {}

  @ResolveField(() => GrantList)
  async resolvedGrantsList(
    @Parent() grantList: GrantCardsList,
  ): Promise<GrantList> {
    const { resolvedGrantsList: input, maxNumberOfCards } = grantList
    if (!input || input?.size === 0 || maxNumberOfCards === 0) {
      return { total: 0, items: [] }
    }

    return this.cmsElasticsearchService.getGrants(
      getElasticsearchIndex(input.lang),
      {
        ...input,
        ...(maxNumberOfCards && {
          size: maxNumberOfCards,
        }),
      },
    )
  }
  @ResolveField(() => GraphQLJSONObject)
  async namespace(@Parent() { resolvedGrantsList: input }: GrantCardsList) {
    try {
      const respones = await this.cmsContentfulService.getNamespace(
        'GrantsPlaza',
        input?.lang ?? 'is',
      )
      return JSON.parse(respones?.fields || '{}')
    } catch {
      // Fallback to empty object in case something goes wrong when fetching or parsing namespace
      return {}
    }
  }
}

@Resolver(() => FeaturedEvents)
@CacheControl(defaultCache)
export class FeaturedEventsResolver {
  constructor(
    private cmsElasticsearchService: CmsElasticsearchService,
    private cmsContentfulService: CmsContentfulService,
  ) {}

  @ResolveField(() => EventList)
  async resolvedEventList(
    @Parent() { resolvedEventList: input }: FeaturedEvents,
  ): Promise<EventList> {
    if (input?.size === 0) {
      return { total: 0, items: [] }
    }

    return this.cmsElasticsearchService.getEvents(
      getElasticsearchIndex(input.lang),
      input,
    )
  }
  @ResolveField(() => GraphQLJSONObject)
  async namespace(@Parent() { resolvedEventList: input }: FeaturedEvents) {
    try {
      const respones = await this.cmsContentfulService.getNamespace(
        'OrganizationPages',
        input.lang,
      )
      return JSON.parse(respones?.fields || '{}')
    } catch {
      // Fallback to empty object in case something goes wrong when fetching or parsing namespace
      return {}
    }
  }
}

@Resolver(() => TeamList)
export class TeamListResolver {
  @ResolveField(() => [TeamMember])
  async teamMembers(@Parent() teamList: TeamList) {
    // The 'accordion' variant has a client side search so to reduce the inital payload (since it isn't used) we simply return an empty list
    if (teamList?.variant === 'accordion') {
      return []
    }

    const teamMembers = teamList.teamMembers ?? []

    if (teamList?.teamMemberOrder !== GetTeamMembersInputOrderBy.Manual) {
      teamMembers.sort(sortAlpha('name'))
    }

    return teamMembers
  }
}

@Resolver(() => LatestGenericListItems)
export class LatestGenericListItemsResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @ResolveField(() => GenericListItemResponse, { nullable: true })
  async itemResponse(
    @Parent() { itemResponse: input }: LatestGenericListItems,
  ) {
    if (!input) {
      return null
    }
    return this.cmsElasticsearchService.getGenericListItems(input)
  }
}

// Just in case the id field is missing from elasticsearch instances we return an empty string to prevent a graphql error since id field is non-nullable
@Resolver(() => IntroLinkImage)
export class IntroLinkImageResolver {
  @ResolveField(() => ID)
  async id(@Parent() { id }: IntroLinkImage) {
    if (!id) {
      return ''
    }
    return id
  }
}

@Resolver(() => GenericList)
export class GenericListResolver {
  @ResolveField(() => [GenericTag])
  async filterTags(
    @Parent() { filterTags, alphabeticallyOrderFilterTags }: GenericList,
  ) {
    const tags = filterTags ?? []
    if (alphabeticallyOrderFilterTags) {
      tags.sort(sortAlpha('title'))
    }
    return tags
  }
}

@Resolver(() => FeaturedGenericListItems)
export class FeaturedGenericListItemsResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @ResolveField(() => [GenericListItem])
  async items(
    @Parent()
    {
      items: { items, input },
      automaticallyFetchItems,
    }: FeaturedGenericListItems,
  ) {
    if (!automaticallyFetchItems) {
      return items
    }
    if (!input) {
      return []
    }

    const response = await this.cmsElasticsearchService.getGenericListItems(
      input,
    )
    return response.items
  }
}
