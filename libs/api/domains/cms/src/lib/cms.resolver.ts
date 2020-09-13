import {
  Args,
  Query,
  Resolver,
  ResolveField,
  Parent,
  Directive,
} from '@nestjs/graphql'
import { Article } from './models/article.model'
import { AdgerdirPage } from './models/adgerdirPage.model'
import { Organization } from './models/organization.model'
import { Organizations } from './models/organizations.model'
import { AdgerdirNews } from './models/adgerdirNews.model'
import { AdgerdirPages } from './models/adgerdirPages.model'
import { AdgerdirFrontpage } from './models/adgerdirFrontpage.model'
import { FrontpageSliderList } from './models/frontpageSliderList.model'
import { GetArticleInput } from './dto/getArticle.input'
import { News } from './models/news.model'
import { GetNewsInput } from './dto/getNews.input'
import { GetNewsListInput } from './dto/getNewsList.input'
import { GetAdgerdirNewsListInput } from './dto/getAdgerdirNewsList.input'
import { GetAdgerdirPageInput } from './dto/getAdgerdirPage.input'
import { GetOrganizationTagsInput } from './dto/getOrganizationTags.input'
import { GetAdgerdirNewsInput } from './dto/getAdgerdirNews.input'
import { GetAdgerdirPagesInput } from './dto/getAdgerdirPages.input'
import { GetOrganizationsInput } from './dto/getOrganizations.input'
import { GetOrganizationInput } from './dto/getOrganization.input'
import { GetAdgerdirFrontpageInput } from './dto/getAdgerdirFrontpage.input'
import { GetFrontpageSliderListInput } from './dto/getFrontpageSliderList.input'
import { PaginatedNews } from './models/paginatedNews.model'
import { Namespace } from './models/namespace.model'
import { AboutPage } from './models/aboutPage.model'
import { LandingPage } from './models/landingPage.model'
import { GenericPage } from './models/genericPage.model'
import { GetNamespaceInput } from './dto/getNamespace.input'
import { GetAboutPageInput } from './dto/getAboutPage.input'
import { GetLandingPageInput } from './dto/getLandingPage.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { GetLifeEventPageInput } from './dto/getLifeEventPage.input'
import { GetLifeEventsInput } from './dto/getLifeEvents.input'
import { GetContentfulAssetBlobInput } from './dto/getContentfulAssetBlob.input'
import {
  getArticle,
  getRelatedArticles,
  getNews,
  getNewsList,
  getNamespace,
  getAboutPage,
  getLandingPage,
  getFrontpageSliderList,
  getGenericPage,
  getAdgerdirPage,
  getOrganization,
  getAdgerdirNews,
  getAdgerdirNewsList,
  getAdgerdirPages,
  getOrganizations,
  getAdgerdirFrontpage,
  getMenu,
  getAdgerdirTags,
  getOrganizationTags,
  getLifeEventPage,
  getLifeEvents,
  fetchContentfulAssetBlob,
} from './services'
import { LatestNewsSlice } from './models/latestNewsSlice.model'
import { Menu } from './models/menu.model'
import { GetMenuInput } from './dto/getMenu.input'
import { AdgerdirTags } from './models/adgerdirTags.model'
import { GetAdgerdirTagsInput } from './dto/getAdgerdirTags.input'
import { LifeEventPage } from './models/lifeEventPage.model'
import { PaginatedAdgerdirNews } from './models/paginatedAdgerdirNews.model'
import { environment } from './environments'
import { OrganizationTags } from './models/organizationTags.model'
import { ContentfulAssetBlob } from './models/contentfulAssetBlob.model'

const { cacheTime } = environment

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
@Directive(cacheControlDirective())
export class CmsResolver {
  @Directive(cacheControlDirective())
  @Query(() => Article, { nullable: true })
  getArticle(@Args('input') input: GetArticleInput): Promise<Article | null> {
    return getArticle(input?.slug ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => News, { nullable: true })
  getNews(@Args('input') input: GetNewsInput): Promise<News | null> {
    return getNews(input.lang ?? 'is-IS', input.slug)
  }

  @Directive(cacheControlDirective())
  @Query(() => PaginatedNews)
  getNewsList(@Args('input') input: GetNewsListInput): Promise<PaginatedNews> {
    return getNewsList(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => PaginatedAdgerdirNews)
  getAdgerdirNewsList(
    @Args('input') input: GetAdgerdirNewsListInput,
  ): Promise<PaginatedAdgerdirNews> {
    return getAdgerdirNewsList(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => Namespace, { nullable: true })
  getNamespace(
    @Args('input') input: GetNamespaceInput,
  ): Promise<Namespace | null> {
    return getNamespace(input?.namespace ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AboutPage)
  getAboutPage(
    @Args('input') input: GetAboutPageInput,
  ): Promise<AboutPage | null> {
    return getAboutPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => LandingPage, { nullable: true })
  getLandingPage(
    @Args('input') input: GetLandingPageInput,
  ): Promise<LandingPage | null> {
    return getLandingPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => GenericPage, { nullable: true })
  getGenericPage(
    @Args('input') input: GetGenericPageInput,
  ): Promise<GenericPage | null> {
    return getGenericPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirPage, { nullable: true })
  getAdgerdirPage(
    @Args('input') input: GetAdgerdirPageInput,
  ): Promise<AdgerdirPage | null> {
    return getAdgerdirPage(input?.slug ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => Organization, { nullable: true })
  getOrganization(
    @Args('input') input: GetOrganizationInput,
  ): Promise<Organization | null> {
    return getOrganization(input?.slug ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirNews, { nullable: true })
  getAdgerdirNews(
    @Args('input') input: GetAdgerdirNewsInput,
  ): Promise<AdgerdirNews | null> {
    return getAdgerdirNews(input?.slug ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirPages)
  getAdgerdirPages(
    @Args('input') input: GetAdgerdirPagesInput,
  ): Promise<AdgerdirPages> {
    return getAdgerdirPages(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => Organizations)
  getOrganizations(
    @Args('input') input: GetOrganizationsInput,
  ): Promise<Organizations> {
    return getOrganizations(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirTags, { nullable: true })
  getAdgerdirTags(
    @Args('input') input: GetAdgerdirTagsInput,
  ): Promise<AdgerdirTags | null> {
    return getAdgerdirTags(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => OrganizationTags, { nullable: true })
  getOrganizationTags(
    @Args('input') input: GetOrganizationTagsInput,
  ): Promise<OrganizationTags | null> {
    return getOrganizationTags(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => FrontpageSliderList, { nullable: true })
  getFrontpageSliderList(
    @Args('input') input: GetFrontpageSliderListInput,
  ): Promise<FrontpageSliderList | null> {
    return getFrontpageSliderList(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => ContentfulAssetBlob)
  getContentfulAssetBlob(
    @Args('input') input: GetContentfulAssetBlobInput,
  ): Promise<ContentfulAssetBlob> {
    return fetchContentfulAssetBlob(input?.url ?? '', input?.type ?? '')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirFrontpage, { nullable: true })
  getAdgerdirFrontpage(
    @Args('input') input: GetAdgerdirFrontpageInput,
  ): Promise<AdgerdirFrontpage | null> {
    return getAdgerdirFrontpage(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => Menu, { nullable: true })
  getMenu(@Args('input') input: GetMenuInput): Promise<Menu | null> {
    return getMenu(input?.name ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => LifeEventPage, { nullable: true })
  getLifeEventPage(
    @Args('input') input: GetLifeEventPageInput,
  ): Promise<LifeEventPage | null> {
    return getLifeEventPage(input.slug, input.lang)
  }

  @Query(() => [LifeEventPage])
  getLifeEvents(
    @Args('input') input: GetLifeEventsInput,
  ): Promise<LifeEventPage[]> {
    return getLifeEvents(input.lang)
  }
}

@Resolver(() => LatestNewsSlice)
export class LatestNewsSliceResolver {
  @ResolveField(() => [News])
  async news() {
    const { news } = await getNewsList({ lang: 'is', perPage: 3 })
    return news
  }
}

@Resolver(() => Article)
export class ArticleResolver {
  @ResolveField(() => [Article])
  async relatedArticles(@Parent() article: Article) {
    return getRelatedArticles(article.slug, 'is')
  }
}
