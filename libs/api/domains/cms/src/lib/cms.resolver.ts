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
import { LatestNewsSlice } from './models/latestNewsSlice.model'
import { Menu } from './models/menu.model'
import { GetMenuInput } from './dto/getMenu.input'
import { AdgerdirTags } from './models/adgerdirTags.model'
import { GetAdgerdirTagsInput } from './dto/getAdgerdirTags.input'
import { LifeEventPage } from './models/lifeEventPage.model'
import { PaginatedAdgerdirNews } from './models/paginatedAdgerdirNews.model'
import { environment } from './environments'
import { OrganizationTags } from './models/organizationTags.model'
import { CmsService } from './cms.service'

const { cacheTime } = environment

const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
@Directive(cacheControlDirective())
export class CmsResolver {
  constructor(private cmsService: CmsService) {}

  @Directive(cacheControlDirective())
  @Query(() => Article, { nullable: true })
  getArticle(@Args('input') input: GetArticleInput): Promise<Article | null> {
    return this.cmsService.getArticle(input?.slug ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => News, { nullable: true })
  getNews(@Args('input') input: GetNewsInput): Promise<News | null> {
    return this.cmsService.getNews(input.lang ?? 'is-IS', input.slug)
  }

  @Directive(cacheControlDirective())
  @Query(() => PaginatedNews)
  getNewsList(@Args('input') input: GetNewsListInput): Promise<PaginatedNews> {
    return this.cmsService.getNewsList(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => PaginatedAdgerdirNews)
  getAdgerdirNewsList(
    @Args('input') input: GetAdgerdirNewsListInput,
  ): Promise<PaginatedAdgerdirNews> {
    return this.cmsService.getAdgerdirNewsList(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => Namespace, { nullable: true })
  getNamespace(
    @Args('input') input: GetNamespaceInput,
  ): Promise<Namespace | null> {
    return this.cmsService.getNamespace(
      input?.namespace ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => AboutPage)
  getAboutPage(
    @Args('input') input: GetAboutPageInput,
  ): Promise<AboutPage | null> {
    return this.cmsService.getAboutPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => LandingPage, { nullable: true })
  getLandingPage(
    @Args('input') input: GetLandingPageInput,
  ): Promise<LandingPage | null> {
    return this.cmsService.getLandingPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => GenericPage, { nullable: true })
  getGenericPage(
    @Args('input') input: GetGenericPageInput,
  ): Promise<GenericPage | null> {
    return this.cmsService.getGenericPage(input)
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirPage, { nullable: true })
  getAdgerdirPage(
    @Args('input') input: GetAdgerdirPageInput,
  ): Promise<AdgerdirPage | null> {
    return this.cmsService.getAdgerdirPage(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => Organization, { nullable: true })
  getOrganization(
    @Args('input') input: GetOrganizationInput,
  ): Promise<Organization | null> {
    return this.cmsService.getOrganization(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirNews, { nullable: true })
  getAdgerdirNews(
    @Args('input') input: GetAdgerdirNewsInput,
  ): Promise<AdgerdirNews | null> {
    return this.cmsService.getAdgerdirNews(
      input?.slug ?? '',
      input?.lang ?? 'is-IS',
    )
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirPages)
  getAdgerdirPages(
    @Args('input') input: GetAdgerdirPagesInput,
  ): Promise<AdgerdirPages> {
    return this.cmsService.getAdgerdirPages(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => Organizations)
  getOrganizations(
    @Args('input') input: GetOrganizationsInput,
  ): Promise<Organizations> {
    return this.cmsService.getOrganizations(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirTags, { nullable: true })
  getAdgerdirTags(
    @Args('input') input: GetAdgerdirTagsInput,
  ): Promise<AdgerdirTags | null> {
    return this.cmsService.getAdgerdirTags(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => OrganizationTags, { nullable: true })
  getOrganizationTags(
    @Args('input') input: GetOrganizationTagsInput,
  ): Promise<OrganizationTags | null> {
    return this.cmsService.getOrganizationTags(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => FrontpageSliderList, { nullable: true })
  getFrontpageSliderList(
    @Args('input') input: GetFrontpageSliderListInput,
  ): Promise<FrontpageSliderList | null> {
    return this.cmsService.getFrontpageSliderList(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => AdgerdirFrontpage, { nullable: true })
  getAdgerdirFrontpage(
    @Args('input') input: GetAdgerdirFrontpageInput,
  ): Promise<AdgerdirFrontpage | null> {
    return this.cmsService.getAdgerdirFrontpage(input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => Menu, { nullable: true })
  getMenu(@Args('input') input: GetMenuInput): Promise<Menu | null> {
    return this.cmsService.getMenu(input?.name ?? '', input?.lang ?? 'is-IS')
  }

  @Directive(cacheControlDirective())
  @Query(() => LifeEventPage, { nullable: true })
  getLifeEventPage(
    @Args('input') input: GetLifeEventPageInput,
  ): Promise<LifeEventPage | null> {
    return this.cmsService.getLifeEventPage(input.slug, input.lang)
  }

  @Query(() => [LifeEventPage])
  getLifeEvents(
    @Args('input') input: GetLifeEventsInput,
  ): Promise<LifeEventPage[]> {
    return this.cmsService.getLifeEvents(input.lang)
  }
}

@Resolver(() => LatestNewsSlice)
export class LatestNewsSliceResolver {
  constructor(private cmsService: CmsService) {}

  @ResolveField(() => [News])
  async news() {
    const { news } = await this.cmsService.getNewsList({
      lang: 'is',
      perPage: 3,
    })
    return news
  }
}

@Resolver(() => Article)
export class ArticleResolver {
  constructor(private cmsService: CmsService) {}

  @ResolveField(() => [Article])
  async relatedArticles(@Parent() article: Article) {
    return this.cmsService.getRelatedArticles(article.slug, 'is')
  }
}
