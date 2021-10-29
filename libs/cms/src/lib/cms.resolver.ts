import {
  Args,
  Query,
  Resolver,
  ResolveField,
  Parent,
  Directive,
} from '@nestjs/graphql'
import { Article } from './models/article.model'
import { ContentSlug } from './models/contentSlug.model'
import { AdgerdirPage } from './models/adgerdirPage.model'
import { Organization } from './models/organization.model'
import { Organizations } from './models/organizations.model'
import { AdgerdirPages } from './models/adgerdirPages.model'
import { AdgerdirFrontpage } from './models/adgerdirFrontpage.model'
import { News } from './models/news.model'
import { GetSingleNewsInput } from './dto/getSingleNews.input'
import { GetAdgerdirPageInput } from './dto/getAdgerdirPage.input'
import { GetOrganizationTagsInput } from './dto/getOrganizationTags.input'
import { GetAdgerdirPagesInput } from './dto/getAdgerdirPages.input'
import { GetOrganizationsInput } from './dto/getOrganizations.input'
import { GetOrganizationInput } from './dto/getOrganization.input'
import { GetAdgerdirFrontpageInput } from './dto/getAdgerdirFrontpage.input'
import { GetErrorPageInput } from './dto/getErrorPage.input'
import { Namespace } from './models/namespace.model'
import { AlertBanner } from './models/alertBanner.model'
import { GenericPage } from './models/genericPage.model'
import { GenericOverviewPage } from './models/genericOverviewPage.model'
import { GetNamespaceInput } from './dto/getNamespace.input'
import { GetAlertBannerInput } from './dto/getAlertBanner.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { GetGenericOverviewPageInput } from './dto/getGenericOverviewPage.input'
import { GetLifeEventPageInput } from './dto/getLifeEventPage.input'
import { GetLifeEventsInput } from './dto/getLifeEvents.input'
import { Menu } from './models/menu.model'
import { GetMenuInput } from './dto/getMenu.input'
import { AdgerdirTags } from './models/adgerdirTags.model'
import { GetAdgerdirTagsInput } from './dto/getAdgerdirTags.input'
import { LifeEventPage } from './models/lifeEventPage.model'
import { environment } from './environments'
import { OrganizationTags } from './models/organizationTags.model'
import { CmsContentfulService } from './cms.contentful.service'
import { CmsElasticsearchService } from './cms.elasticsearch.service'
import { ArticleCategory } from './models/articleCategory.model'
import { GetArticleCategoriesInput } from './dto/getArticleCategories.input'
import { GetArticlesInput } from './dto/getArticles.input'
import { GetContentSlugInput } from './dto/getContentSlug.input'
import { GetLifeEventsInCategoryInput } from './dto/getLifeEventsInCategory.input'
import { GetUrlInput } from './dto/getUrl.input'
import { Url } from './models/url.model'
import { GetSingleArticleInput } from './dto/getSingleArticle.input'
import { LatestNewsSlice } from './models/latestNewsSlice.model'
import { GetNewsInput } from './dto/getNews.input'
import { GetNewsDatesInput } from './dto/getNewsDates.input'
import { NewsList } from './models/newsList.model'
import { GetTellUsAStoryInput } from './dto/getTellUsAStory.input'
import { TellUsAStory } from './models/tellUsAStory.model'
import { GroupedMenu } from './models/groupedMenu.model'
import { GetSingleMenuInput } from './dto/getSingleMenu.input'
import { SubpageHeader } from './models/subpageHeader.model'
import { GetSubpageHeaderInput } from './dto/getSubpageHeader.input'
import { ErrorPage } from './models/errorPage.model'
import { OrganizationSubpage } from './models/organizationSubpage.model'
import { GetOrganizationSubpageInput } from './dto/getOrganizationSubpage.input'
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
import { SupportForm } from './models/supportForm.model'
import { GetSupportFormInOrganizationInput } from './dto/getSupportFormInOrganization.input'
import { GetSupportCategoriesInput } from './dto/getSupportCategories.input'
import { GetSupportCategoriesInOrganizationInput } from './dto/getSupportCategoriesInOrganization.input'

const { cacheTime } = environment

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
@Directive(cacheControlDirective())
export class CmsResolver {
  constructor(
    private readonly cmsContentfulService: CmsContentfulService,
    private readonly cmsElasticsearchService: CmsElasticsearchService,
  ) {}

  @Directive(cacheControlDirective())
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
  @Directive(cacheControlDirective())
  @Query(() => ContentSlug, { nullable: true })
  getContentSlug(
    @Args('input') input: GetContentSlugInput,
  ): Promise<ContentSlug | null> {
    return this.cmsContentfulService.getContentSlug(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => AlertBanner, { nullable: true })
  getAlertBanner(
    @Args('input') input: GetAlertBannerInput,
  ): Promise<AlertBanner | null> {
    return this.cmsContentfulService.getAlertBanner(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => GenericPage, { nullable: true })
  getGenericPage(
    @Args('input') input: GetGenericPageInput,
  ): Promise<GenericPage | null> {
    return this.cmsContentfulService.getGenericPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => GenericOverviewPage, { nullable: true })
  getGenericOverviewPage(
    @Args('input') input: GetGenericOverviewPageInput,
  ): Promise<GenericOverviewPage | null> {
    return this.cmsContentfulService.getGenericOverviewPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirPage, { nullable: true })
  getAdgerdirPage(
    @Args('input') input: GetAdgerdirPageInput,
  ): Promise<AdgerdirPage | null> {
    return this.cmsContentfulService.getAdgerdirPage(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => ErrorPage, { nullable: true })
  getErrorPage(
    @Args('input') input: GetErrorPageInput,
  ): Promise<ErrorPage | null> {
    return this.cmsContentfulService.getErrorPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => OpenDataPage)
  getOpenDataPage(
    @Args('input') input: GetOpenDataPageInput,
  ): Promise<OpenDataPage | null> {
    return this.cmsContentfulService.getOpenDataPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => OpenDataSubpage)
  getOpenDataSubpage(
    @Args('input') input: GetOpenDataSubpageInput,
  ): Promise<OpenDataSubpage | null> {
    return this.cmsContentfulService.getOpenDataSubpage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => Organization, { nullable: true })
  getOrganization(
    @Args('input') input: GetOrganizationInput,
  ): Promise<Organization | null> {
    return this.cmsContentfulService.getOrganization(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => OrganizationPage, { nullable: true })
  getOrganizationPage(
    @Args('input') input: GetOrganizationPageInput,
  ): Promise<OrganizationPage | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
      getElasticsearchIndex(input.lang),
      { type: 'webOrganizationPage', slug: input.slug },
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => OrganizationSubpage, { nullable: true })
  getOrganizationSubpage(
    @Args('input') input: GetOrganizationSubpageInput,
  ): Promise<OrganizationSubpage | null> {
    return this.cmsElasticsearchService.getSingleOrganizationSubpage(
      getElasticsearchIndex(input.lang),
      { ...input },
    )
  }

  @Directive(cacheControlDirective())
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

  @Directive(cacheControlDirective())
  @Query(() => Auction)
  getAuction(@Args('input') input: GetAuctionInput): Promise<Auction | null> {
    return this.cmsContentfulService.getAuction(input.id, input.lang)
  }

  @Directive(cacheControlDirective())
  @Query(() => ProjectPage, { nullable: true })
  getProjectPage(
    @Args('input') input: GetProjectPageInput,
  ): Promise<ProjectPage | null> {
    return this.cmsContentfulService.getProjectPage(input.slug, input.lang)
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirPages)
  getAdgerdirPages(
    @Args('input') input: GetAdgerdirPagesInput,
  ): Promise<AdgerdirPages> {
    return this.cmsContentfulService.getAdgerdirPages(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => Organizations)
  getOrganizations(
    @Args('input') input: GetOrganizationsInput,
  ): Promise<Organizations> {
    return this.cmsContentfulService.getOrganizations(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirTags, { nullable: true })
  getAdgerdirTags(
    @Args('input') input: GetAdgerdirTagsInput,
  ): Promise<AdgerdirTags | null> {
    return this.cmsContentfulService.getAdgerdirTags(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => OrganizationTags, { nullable: true })
  getOrganizationTags(
    @Args('input') input: GetOrganizationTagsInput,
  ): Promise<OrganizationTags | null> {
    return this.cmsContentfulService.getOrganizationTags(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirFrontpage, { nullable: true })
  getAdgerdirFrontpage(
    @Args('input') input: GetAdgerdirFrontpageInput,
  ): Promise<AdgerdirFrontpage | null> {
    return this.cmsContentfulService.getAdgerdirFrontpage(
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => LifeEventPage, { nullable: true })
  getLifeEventPage(
    @Args('input') input: GetLifeEventPageInput,
  ): Promise<LifeEventPage | null> {
    return this.cmsContentfulService.getLifeEventPage(input.slug, input.lang)
  }

  @Directive(cacheControlDirective())
  @Query(() => [LifeEventPage])
  getLifeEvents(
    @Args('input') input: GetLifeEventsInput,
  ): Promise<LifeEventPage[]> {
    return this.cmsContentfulService.getLifeEvents(input.lang)
  }

  @Directive(cacheControlDirective())
  @Query(() => [LifeEventPage])
  getLifeEventsInCategory(
    @Args('input') input: GetLifeEventsInCategoryInput,
  ): Promise<LifeEventPage[]> {
    return this.cmsContentfulService.getLifeEventsInCategory(
      input.lang,
      input.slug,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => Url, { nullable: true })
  getUrl(@Args('input') input: GetUrlInput): Promise<Url | null> {
    return this.cmsContentfulService.getUrl(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => TellUsAStory)
  getTellUsAStory(
    @Args('input') input: GetTellUsAStoryInput,
  ): Promise<TellUsAStory> {
    return this.cmsContentfulService.getTellUsAStory(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => Frontpage, { nullable: true })
  getFrontpage(
    @Args('input') input: GetFrontpageInput,
  ): Promise<Frontpage | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug(
      getElasticsearchIndex(input.lang),
      { type: 'webFrontpage', slug: input.pageIdentifier },
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => [ArticleCategory])
  getArticleCategories(
    @Args('input') input: GetArticleCategoriesInput,
  ): Promise<ArticleCategory[]> {
    return this.cmsElasticsearchService.getArticleCategories(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => Article, { nullable: true })
  getSingleArticle(
    @Args('input') { lang, slug }: GetSingleArticleInput,
  ): Promise<Article | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug<Article>(
      getElasticsearchIndex(lang),
      { type: 'webArticle', slug },
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => [Article])
  getArticles(@Args('input') input: GetArticlesInput): Promise<Article[]> {
    return this.cmsElasticsearchService.getArticles(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => News, { nullable: true })
  getSingleNews(
    @Args('input') { lang, slug }: GetSingleNewsInput,
  ): Promise<News | null> {
    return this.cmsElasticsearchService.getSingleDocumentTypeBySlug<News>(
      getElasticsearchIndex(lang),
      { type: 'webNews', slug },
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => [String])
  getNewsDates(@Args('input') input: GetNewsDatesInput): Promise<string[]> {
    return this.cmsElasticsearchService.getNewsDates(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => NewsList)
  getNews(@Args('input') input: GetNewsInput): Promise<NewsList> {
    return this.cmsElasticsearchService.getNews(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => Menu, { nullable: true })
  getMenu(@Args('input') input: GetMenuInput): Promise<Menu | null> {
    return this.cmsElasticsearchService.getSingleMenuByName(
      getElasticsearchIndex(input.lang),
      { ...input },
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => GroupedMenu, { nullable: true })
  getGroupedMenu(
    @Args('input') input: GetSingleMenuInput,
  ): Promise<GroupedMenu | null> {
    return this.cmsElasticsearchService.getSingleMenu<GroupedMenu>(
      getElasticsearchIndex(input.lang),
      input,
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => SubpageHeader, { nullable: true })
  getSubpageHeader(
    @Args('input') input: GetSubpageHeaderInput,
  ): Promise<SubpageHeader | null> {
    return this.cmsContentfulService.getSubpageHeader(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [SupportQNA])
  getSupportQNAs(
    @Args('input') input: GetSupportQNAsInput,
  ): Promise<SupportQNA[]> {
    return this.cmsContentfulService.getSupportQNAs(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [SupportQNA])
  getSupportQNAsInCategory(
    @Args('input') input: GetSupportQNAsInCategoryInput,
  ): Promise<SupportQNA[]> {
    return this.cmsContentfulService.getSupportQNAsInCategory(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => SupportCategory)
  getSupportCategory(
    @Args('input') input: GetSupportCategoryInput,
  ): Promise<SupportCategory> {
    return this.cmsContentfulService.getSupportCategory(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [SupportCategory])
  getSupportCategories(
    @Args('input') input: GetSupportCategoriesInput,
  ): Promise<SupportCategory[]> {
    return this.cmsContentfulService.getSupportCategories(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [SupportCategory])
  getSupportCategoriesInOrganization(
    @Args('input') input: GetSupportCategoriesInOrganizationInput,
  ): Promise<SupportCategory[]> {
    return this.cmsContentfulService.getSupportCategoriesInOrganization(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => [SupportForm])
  getSupportFormInOrganization(
    @Args('input') input: GetSupportFormInOrganizationInput,
  ): Promise<SupportForm[]> {
    return this.cmsContentfulService.getSupportFormInOrganization(input)
  }
}

@Resolver(() => LatestNewsSlice)
@Directive(cacheControlDirective())
export class LatestNewsSliceResolver {
  constructor(private cmsElasticsearchService: CmsElasticsearchService) {}

  @Directive(cacheControlDirective())
  @ResolveField(() => [News])
  async news(@Parent() { news: input }: LatestNewsSlice): Promise<News[]> {
    const newsList = await this.cmsElasticsearchService.getNews(
      getElasticsearchIndex(input.lang),
      input,
    )
    return newsList.items
  }
}

@Resolver(() => Article)
@Directive(cacheControlDirective())
export class ArticleResolver {
  constructor(private cmsContentfulService: CmsContentfulService) {}

  @Directive(cacheControlDirective())
  @ResolveField(() => [Article])
  async relatedArticles(@Parent() article: Article) {
    return this.cmsContentfulService.getRelatedArticles(article.slug, 'is')
  }
}
