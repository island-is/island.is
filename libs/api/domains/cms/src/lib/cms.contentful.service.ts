/* eslint-disable @typescript-eslint/no-use-before-define */
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Injectable } from '@nestjs/common'
import sortBy from 'lodash/sortBy'
import * as types from './generated/contentfulTypes'
import { Article, mapArticle } from './models/article.model'
import { ContentSlug, mapContentSlug } from './models/contentSlug.model'
import { AboutPage, mapAboutPage } from './models/aboutPage.model'
import { GenericPage, mapGenericPage } from './models/genericPage.model'
import {
  GenericOverviewPage,
  mapGenericOverviewPage,
} from './models/genericOverviewPage.model'
import { News, mapNews } from './models/news.model'
import { Pagination } from './models/pagination.model'
import {
  AdgerdirFrontpage,
  mapAdgerdirFrontpage,
} from './models/adgerdirFrontpage.model'
import { AdgerdirPages } from './models/adgerdirPages.model'
import { AdgerdirPage, mapAdgerdirPage } from './models/adgerdirPage.model'
import { GetContentSlugInput } from './dto/getContentSlug.input'
import { GetAboutPageInput } from './dto/getAboutPage.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { GetGenericOverviewPageInput } from './dto/getGenericOverviewPage.input'
import { Namespace, mapNamespace } from './models/namespace.model'
import { Menu, mapMenu } from './models/menu.model'
import { LifeEventPage, mapLifeEventPage } from './models/lifeEventPage.model'
import { AdgerdirTags } from './models/adgerdirTags.model'
import { Organization } from './models/organization.model'
import { Organizations } from './models/organizations.model'
import { mapAdgerdirTag } from './models/adgerdirTag.model'
import { mapOrganization } from './models/organization.model'
import { OrganizationTags } from './models/organizationTags.model'
import { mapOrganizationTag } from './models/organizationTag.model'
import {
  FrontpageSliderList,
  mapFrontpageSliderList,
} from './models/frontpageSliderList.model'
import { ContentfulRepository } from './contentful.repository'
import { GetAlertBannerInput } from './dto/getAlertBanner.input'
import { AlertBanner, mapAlertBanner } from './models/alertBanner.model'
import { mapUrl, Url } from './models/url.model'
import { AboutSubPage, mapAboutSubPage } from './models/aboutSubPage.model'
import { Homepage, mapHomepage } from './models/homepage.model'
import { mapTellUsAStory, TellUsAStory } from './models/tellUsAStory.model'
import { GetSubpageHeaderInput } from './dto/getSubpageHeader.input'
import { mapSubpageHeader, SubpageHeader } from './models/subpageHeader.model'

const makePage = (
  page: number,
  perPage: number,
  totalResults: number,
): Pagination => ({
  page,
  perPage,
  totalResults,
  totalPages: Math.ceil(totalResults / perPage),
})

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in ' + name)
  }
}

const ArticleFields = [
  // we want to exclude relatedArticles because it's a self-referencing
  // relation and selecting related articles to a depth of 10 would make the
  // response huge
  'sys',
  'fields.slug',
  'fields.title',
  'fields.shortTitle',
  'fields.content',
  'fields.subgroup',
  'fields.group',
  'fields.category',
  'fields.subArticles',
].join(',')

@Injectable()
export class CmsContentfulService {
  constructor(private contentfulRepository: ContentfulRepository) {}

  async getAdgerdirFrontpage(lang = 'is-IS'): Promise<AdgerdirFrontpage> {
    const params = {
      ['content_type']: 'vidspyrna-frontpage',
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaFrontpageFields>(lang, params)
      .catch(errorHandler('getVidspyrnaFrontpage'))

    return result.items.map(mapAdgerdirFrontpage)[0] ?? null
  }

  async getAdgerdirPages(lang = 'is-IS'): Promise<AdgerdirPages> {
    const params = {
      ['content_type']: 'vidspyrnaPage',
      include: 10,
      limit: 100,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaPageFields>(lang, params)
      .catch(errorHandler('getAdgerdirPages'))

    return {
      items: result.items.map(mapAdgerdirPage),
    }
  }

  async getOrganizations(lang = 'is-IS'): Promise<Organizations> {
    const params = {
      ['content_type']: 'organization',
      include: 10,
      limit: 1000,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(lang, params)
      .catch(errorHandler('getOrganizations'))

    return {
      items: result.items
        .map(mapOrganization)
        .filter((organization) => organization.title && organization.slug),
    }
  }

  async getAdgerdirTags(lang = 'is-IS'): Promise<AdgerdirTags> {
    const params = {
      ['content_type']: 'vidspyrnaTag',
      include: 10,
      limit: 100,
    }

    const r = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaTagFields>(lang, params)
      .catch(errorHandler('getAdgerdirTags'))

    return {
      items: r.items.map(mapAdgerdirTag),
    }
  }

  async getOrganizationTags(lang = 'is-IS'): Promise<OrganizationTags> {
    const params = {
      ['content_type']: 'organizationTag',
      include: 10,
      limit: 100,
    }

    const r = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationTagFields>(lang, params)
      .catch(errorHandler('getOrganizationTags'))

    return {
      items: r.items.map(mapOrganizationTag),
    }
  }

  async getFrontpageSliderList(lang = 'is-IS'): Promise<FrontpageSliderList> {
    const params = {
      ['content_type']: 'frontpageSliderList',
      include: 10,
      limit: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IFrontpageSliderListFields>(lang, params)
      .catch(errorHandler('getFrontpageSliderList'))

    return result.items.map(mapFrontpageSliderList)[0] ?? null
  }

  async getAdgerdirPage(slug: string, lang: string): Promise<AdgerdirPage> {
    const params = {
      ['content_type']: 'vidspyrnaPage',
      include: 10,
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IVidspyrnaPageFields>(lang, params)
      .catch(errorHandler('getAdgerdirPage'))

    return result.items.map(mapAdgerdirPage)[0] ?? null
  }

  async getOrganization(slug: string, lang: string): Promise<Organization> {
    const params = {
      ['content_type']: 'organization',
      include: 10,
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IOrganizationFields>(lang, params)
      .catch(errorHandler('getOrganization'))

    return result.items.map(mapOrganization)[0] ?? null
  }

  async getArticle(slug: string, lang: string): Promise<Article | null> {
    const params = {
      ['content_type']: 'article',
      'fields.slug': slug,
      select: ArticleFields,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getArticle'))

    return result.items.map(mapArticle)[0] ?? null
  }

  async getRelatedArticles(slug: string, lang: string): Promise<Article[]> {
    const params = {
      ['content_type']: 'article',
      'fields.slug': slug,
      select: 'fields.relatedArticles',
      include: 1,
    }

    const articleResult = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getRelatedArticles'))

    const articles = articleResult.items[0]?.fields?.relatedArticles ?? []
    if (articles.length === 0) return []

    const relatedResultParams = {
      ['content_type']: 'article',
      'sys.id[in]': articles.map((a) => a.sys.id).join(','),
      select: ArticleFields,
      include: 10,
    }

    const relatedResult = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, relatedResultParams)
      .catch(errorHandler('getRelatedArticles'))

    const sortedIds = articles.map((a) => a.sys.id)
    const results = relatedResult.items.map(mapArticle)
    return sortBy(results, (a) => sortedIds.indexOf(a.id))
  }

  async getNews(lang: string, slug: string): Promise<News | null> {
    const params = {
      ['content_type']: 'news',
      include: 10,
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.INewsFields>(lang, params)
      .catch(errorHandler('getNews'))

    return result.items.map(mapNews)[0] ?? null
  }

  async getAboutPage({ lang }: GetAboutPageInput): Promise<AboutPage | null> {
    const params = {
      ['content_type']: 'page',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IPageFields>(lang, params)
      .catch(errorHandler('getAboutPage'))

    return result.items.map(mapAboutPage)[0] ?? null
  }

  async getAboutSubPage({
    lang,
    url,
  }: {
    lang: string
    url: string
  }): Promise<AboutSubPage | null> {
    const params = {
      ['content_type']: 'aboutSubPage',
      include: 10,
      'fields.url': url,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAboutSubPageFields>(lang, params)
      .catch(errorHandler('getAboutSubPage'))

    return result.items.map(mapAboutSubPage)[0] ?? null
  }

  async getContentSlug({
    id,
    lang,
  }: GetContentSlugInput): Promise<ContentSlug | null> {
    const params = {
      'sys.id': id,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IArticleFields>(lang, params)
      .catch(errorHandler('getContentSlug'))

    return result.items.map(mapContentSlug)[0] ?? null
  }

  async getGenericPage({
    lang,
    slug,
  }: GetGenericPageInput): Promise<GenericPage> {
    const params = {
      ['content_type']: 'genericPage',
      'fields.slug': slug,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericPageFields>(lang, params)
      .catch(errorHandler('getGenericPage'))

    return result.items.map(mapGenericPage)[0] ?? null
  }

  async getGenericOverviewPage({
    lang,
    pageIdentifier,
  }: GetGenericOverviewPageInput): Promise<GenericOverviewPage> {
    const params = {
      ['content_type']: 'genericOverviewPage',
      'fields.pageIdentifier': pageIdentifier,
      include: 10,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IGenericOverviewPageFields>(lang, params)
      .catch(errorHandler('getGenericOverviewPage'))

    return result.items.map(mapGenericOverviewPage)[0] ?? null
  }

  async getNamespace(
    namespace: string,
    lang: string,
  ): Promise<Namespace | null> {
    const params = {
      ['content_type']: 'uiConfiguration',
      'fields.namespace': namespace,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IUiConfigurationFields>(lang, params)
      .catch(errorHandler('getNamespace'))

    return result.items.map(mapNamespace)[0] ?? null
  }

  async getMenu(name: string, lang: string): Promise<Menu | null> {
    const params = {
      ['content_type']: 'menu',
      'fields.title': name,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IMenuFields>(lang, params)
      .catch(errorHandler('getMenu'))

    return result.items.map(mapMenu)[0] ?? null
  }

  async getLifeEventPage(
    slug: string,
    lang: string,
  ): Promise<LifeEventPage | null> {
    const params = {
      ['content_type']: 'lifeEventPage',
      'fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEventPage'))

    return result.items.map(mapLifeEventPage)[0] ?? null
  }

  async getLifeEvents(lang: string): Promise<LifeEventPage[]> {
    const params = {
      ['content_type']: 'lifeEventPage',
      order: 'sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEvents'))

    return result.items.map(mapLifeEventPage)
  }

  async getAlertBanner({
    lang,
    id,
  }: GetAlertBannerInput): Promise<AlertBanner | null> {
    const params = {
      ['content_type']: 'alertBanner',
      'sys.id': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IAlertBannerFields>(lang, params)
      .catch(errorHandler('getAlertBanner'))

    return result.items.map(mapAlertBanner)[0] ?? null
  }

  async getUrl(slug: string, lang: string): Promise<Url | null> {
    const params = {
      ['content_type']: 'url',
      'fields.urlsList[all]': slug,
      include: 1,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IUrlFields>(lang, params)
      .catch(errorHandler('getUrl'))
    return result.items.map(mapUrl)[0] ?? null
  }

  async getLifeEventsInCategory(
    lang: string,
    slug: string,
  ): Promise<LifeEventPage[]> {
    const params = {
      ['content_type']: 'lifeEventPage',
      'fields.category.sys.contentType.sys.id': 'articleCategory',
      'fields.category.fields.slug': slug,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ILifeEventPageFields>(lang, params)
      .catch(errorHandler('getLifeEventsInCategory'))

    return result.items.map(mapLifeEventPage)
  }

  async getHomepage({ lang }: { lang: string }): Promise<Homepage> {
    const params = {
      ['content_type']: 'homepage',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.IHomepageFields>(lang, params)
      .catch(errorHandler('getHomepage'))

    return result.items.map(mapHomepage)[0]
  }

  async getTellUsAStory({ lang }: { lang: string }): Promise<TellUsAStory> {
    const params = {
      ['content_type']: 'tellUsAStory',
      include: 10,
      order: '-sys.createdAt',
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ITellUsAStoryFields>(lang, params)
      .catch(errorHandler('getTellUsAStory'))

    return result.items.map(mapTellUsAStory)[0]
  }

  async getSubpageHeader({
    lang,
    id,
  }: GetSubpageHeaderInput): Promise<SubpageHeader> {
    const params = {
      ['content_type']: 'subpageHeader',
      'fields.subpageId': id,
    }

    const result = await this.contentfulRepository
      .getLocalizedEntries<types.ISubpageHeaderFields>(lang, params)
      .catch(errorHandler('getSubpageHeader'))

    return result.items.map(mapSubpageHeader)[0]
  }
}
