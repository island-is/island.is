/* eslint-disable @typescript-eslint/no-use-before-define */
import { getLocalizedEntries } from './contentful'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import * as types from './generated/contentfulTypes'
import { Article, mapArticle } from './models/article.model'
import { AboutPage, mapAboutPage } from './models/aboutPage.model'
import { LandingPage, mapLandingPage } from './models/landingPage.model'
import { GenericPage, mapGenericPage } from './models/genericPage.model'
import { News, mapNews } from './models/news.model'
import { Pagination } from './models/pagination.model'
import {
  AdgerdirFrontpage,
  mapAdgerdirFrontpage,
} from './models/adgerdirFrontpage.model'
import { AdgerdirPages } from './models/adgerdirPages.model'
import { AdgerdirPage, mapAdgerdirPage } from './models/adgerdirPage.model'
import { AdgerdirNews, mapAdgerdirNewsItem } from './models/adgerdirNews.model'
import { GetNewsListInput } from './dto/getNewsList.input'
import { GetAdgerdirNewsListInput } from './dto/getAdgerdirNewsList.input'
import { PaginatedNews } from './models/paginatedNews.model'
import { GetAboutPageInput } from './dto/getAboutPage.input'
import { GetLandingPageInput } from './dto/getLandingPage.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { Namespace, mapNamespace } from './models/namespace.model'
import { Menu, mapMenu } from './models/menu.model'
import { LifeEventPage, mapLifeEventPage } from './models/lifeEventPage.model'
import { PaginatedAdgerdirNews } from './models/paginatedAdgerdirNews.model'
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

export const getAdgerdirFrontpage = async (
  lang = 'is',
): Promise<AdgerdirFrontpage> => {
  const result = await getLocalizedEntries<types.IVidspyrnaFrontpageFields>(
    lang,
    {
      ['content_type']: 'vidspyrna-frontpage',
      include: 10,
    },
  ).catch(errorHandler('getVidspyrnaFrontpage'))

  return result.items.map(mapAdgerdirFrontpage)[0] ?? null
}

export const getAdgerdirPages = async (lang = 'is'): Promise<AdgerdirPages> => {
  const params = {
    ['content_type']: 'vidspyrnaPage',
    include: 10,
    limit: 100,
  }

  const result = await getLocalizedEntries<types.IVidspyrnaPageFields>(
    lang,
    params,
  ).catch(errorHandler('getAdgerdirPages'))

  return {
    items: result.items.map(mapAdgerdirPage),
  }
}

export const getOrganizations = async (lang = 'is'): Promise<Organizations> => {
  const params = {
    ['content_type']: 'organization',
    include: 10,
    limit: 100,
  }

  const result = await getLocalizedEntries<types.IOrganizationFields>(
    lang,
    params,
  ).catch(errorHandler('getOrganizations'))

  return {
    items: result.items.map(mapOrganization),
  }
}

export const getAdgerdirTags = async (lang = 'is'): Promise<AdgerdirTags> => {
  const params = {
    ['content_type']: 'vidspyrnaTag',
    include: 10,
    limit: 100,
  }

  const r = await getLocalizedEntries<types.IVidspyrnaTagFields>(
    lang,
    params,
  ).catch(errorHandler('getAdgerdirTags'))

  return {
    items: r.items.map(mapAdgerdirTag),
  }
}

export const getOrganizationTags = async (
  lang = 'is-IS',
): Promise<OrganizationTags> => {
  const params = {
    ['content_type']: 'organizationTag',
    include: 10,
    limit: 100,
  }

  const r = await getLocalizedEntries<types.IOrganizationTagFields>(
    lang,
    params,
  ).catch(errorHandler('getOrganizationTags'))

  return {
    items: r.items.map(mapOrganizationTag),
  }
}

export const getFrontpageSliderList = async (
  lang = 'is',
): Promise<FrontpageSliderList> => {
  const params = {
    ['content_type']: 'frontpageSliderList',
    include: 10,
    limit: 1,
  }

  const result = await getLocalizedEntries<types.IFrontpageSliderListFields>(
    lang,
    params,
  ).catch(errorHandler('getFrontpageSliderList'))

  return result.items.map(mapFrontpageSliderList)[0] ?? null
}

export const getAdgerdirPage = async (
  slug: string,
  lang: string,
): Promise<AdgerdirPage> => {
  const result = await getLocalizedEntries<types.IVidspyrnaPageFields>(lang, {
    ['content_type']: 'vidspyrnaPage',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getAdgerdirPage'))

  return result.items.map(mapAdgerdirPage)[0] ?? null
}

export const getOrganization = async (
  slug: string,
  lang: string,
): Promise<Organization> => {
  const result = await getLocalizedEntries<types.IOrganizationFields>(lang, {
    ['content_type']: 'organization',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getOrganization'))

  return result.items.map(mapOrganization)[0] ?? null
}

const ArticleFields = [
  // we want to exclude relatedArticles because it's a self-referencing
  // relation and selecting related articles to a depth of 10 would make the
  // response huge
  'sys',
  'fields.slug',
  'fields.title',
  'fields.content',
  'fields.subgroup',
  'fields.group',
  'fields.category',
].join(',')

export const getAdgerdirNews = async (
  slug: string,
  lang: string,
): Promise<AdgerdirNews> => {
  const result = await getLocalizedEntries<types.IVidspyrnaNewsFields>(lang, {
    ['content_type']: 'vidspyrnaNews',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getAdgerdirNews'))

  return result.items.map(mapAdgerdirNewsItem)[0] ?? null
}

export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article | null> => {
  const result = await getLocalizedEntries<types.IArticleFields>(lang, {
    ['content_type']: 'article',
    'fields.slug': slug,
    select: ArticleFields,
    include: 10,
  }).catch(errorHandler('getArticle'))

  return result.items.map(mapArticle)[0] ?? null
}

export const getRelatedArticles = async (
  slug: string,
  lang: string,
): Promise<Article[]> => {
  const articleResult = await getLocalizedEntries<types.IArticleFields>(lang, {
    ['content_type']: 'article',
    'fields.slug': slug,
    select: 'fields.relatedArticles',
    include: 1,
  }).catch(errorHandler('getRelatedArticles'))

  const articles = articleResult.items[0]?.fields?.relatedArticles ?? []
  if (articles.length === 0) return []

  const relatedResult = await getLocalizedEntries<types.IArticleFields>(lang, {
    ['content_type']: 'article',
    'sys.id[in]': articles.map((a) => a.sys.id).join(','),
    select: ArticleFields,
    include: 10,
  }).catch(errorHandler('getRelatedArticles'))

  return relatedResult.items.map(mapArticle)
}

export const getNews = async (
  lang: string,
  slug: string,
): Promise<News | null> => {
  const result = await getLocalizedEntries<types.INewsFields>(lang, {
    ['content_type']: 'news',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getNews'))

  return result.items.map(mapNews)[0] ?? null
}

export const getNewsList = async ({
  lang = 'is',
  year,
  month,
  ascending = false,
  page = 1,
  perPage = 10,
}: GetNewsListInput): Promise<PaginatedNews> => {
  const params = {
    ['content_type']: 'news',
    include: 10,
    order: (ascending ? '' : '-') + 'fields.date',
    skip: (page - 1) * perPage,
    limit: perPage,
  }

  if (year) {
    params['fields.date[gte]'] = new Date(year, month ?? 0, 1)
    params['fields.date[lt]'] =
      month != undefined
        ? new Date(year, month + 1, 1)
        : new Date(year + 1, 0, 1)
  }

  const result = await getLocalizedEntries<types.INewsFields>(
    lang,
    params,
  ).catch(errorHandler('getNewsList'))

  return {
    page: makePage(page, perPage, result.total),
    news: result.items.map(mapNews),
  }
}

export const getAdgerdirNewsList = async ({
  lang = 'is',
  year,
  month,
  ascending = false,
  page = 1,
  perPage = 10,
}: GetAdgerdirNewsListInput): Promise<PaginatedAdgerdirNews> => {
  const params = {
    ['content_type']: 'vidspyrnaNews',
    include: 10,
    order: (ascending ? '' : '-') + 'fields.date',
    skip: (page - 1) * perPage,
    limit: perPage,
  }

  if (year) {
    params['fields.date[gte]'] = new Date(year, month ?? 0, 1)
    params['fields.date[lt]'] =
      month != undefined
        ? new Date(year, month + 1, 1)
        : new Date(year + 1, 0, 1)
  }

  const result = await getLocalizedEntries<types.IVidspyrnaNewsFields>(
    lang,
    params,
  ).catch(errorHandler('getAdgerdirNewsList'))

  return {
    page: makePage(page, perPage, result.total),
    news: result.items.map(mapAdgerdirNewsItem),
  }
}

export const getAboutPage = async ({
  lang,
}: GetAboutPageInput): Promise<AboutPage | null> => {
  const result = await getLocalizedEntries<types.IPageFields>(lang, {
    ['content_type']: 'page',
    include: 10,
    order: '-sys.createdAt',
  }).catch(errorHandler('getPage'))

  return result.items.map(mapAboutPage)[0] ?? null
}

export const getLandingPage = async ({
  lang,
  slug,
}: GetLandingPageInput): Promise<LandingPage | null> => {
  const result = await getLocalizedEntries<types.ILandingPageFields>(lang, {
    ['content_type']: 'landingPage',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getLandingPage'))

  return result.items.map(mapLandingPage)[0] ?? null
}

export const getGenericPage = async ({
  lang,
  slug,
}: GetGenericPageInput): Promise<GenericPage> => {
  const result = await getLocalizedEntries<types.IGenericPageFields>(lang, {
    ['content_type']: 'genericPage',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getGenericPage'))

  return result.items.map(mapGenericPage)[0] ?? null
}

export const getNamespace = async (
  namespace: string,
  lang: string,
): Promise<Namespace | null> => {
  const result = await getLocalizedEntries<types.IUiConfigurationFields>(lang, {
    ['content_type']: 'uiConfiguration',
    'fields.namespace': namespace,
  }).catch(errorHandler('getNamespace'))

  return result.items.map(mapNamespace)[0] ?? null
}

export const getMenu = async (
  name: string,
  lang: string,
): Promise<Menu | null> => {
  const result = await getLocalizedEntries<types.IMenuFields>(lang, {
    ['content_type']: 'menu',
    'fields.title': name,
  }).catch(errorHandler('getMenu'))

  return result.items.map(mapMenu)[0] ?? null
}

export const getLifeEventPage = async (
  slug: string,
  lang: string,
): Promise<LifeEventPage | null> => {
  const result = await getLocalizedEntries<types.ILifeEventPageFields>(lang, {
    ['content_type']: 'lifeEventPage',
    'fields.slug': slug,
  }).catch(errorHandler('getLifeEventPage'))

  return result.items.map(mapLifeEventPage)[0] ?? null
}

export const getLifeEvents = async (lang: string): Promise<LifeEventPage[]> => {
  const result = await getLocalizedEntries<types.ILifeEventPageFields>(lang, {
    ['content_type']: 'lifeEventPage',
    order: '-sys.createdAt',
  }).catch(errorHandler('getLifeEvents'))

  return result.items.map(mapLifeEventPage)
}
