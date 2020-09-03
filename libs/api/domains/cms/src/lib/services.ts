/* eslint-disable @typescript-eslint/no-use-before-define */
import { getLocalizedEntries } from './contentful'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import * as mappers from './mappers'
import * as types from './generated/contentfulTypes'
import { Article } from './models/article.model'
import { AboutPage } from './models/aboutPage.model'
import { LandingPage } from './models/landingPage.model'
import { GenericPage } from './models/genericPage.model'
import { News } from './models/news.model'
import { Pagination } from './models/pagination.model'
import { AdgerdirFrontpage } from './models/adgerdirFrontpage.model'
import { AdgerdirPages } from './models/adgerdirPages.model'
import { AdgerdirPage } from './models/adgerdirPage.model'
import { GetNewsListInput } from './dto/getNewsList.input'
import { PaginatedNews } from './models/paginatedNews.model'
import { GetAboutPageInput } from './dto/getAboutPage.input'
import { GetLandingPageInput } from './dto/getLandingPage.input'
import { GetGenericPageInput } from './dto/getGenericPage.input'
import { Namespace } from './models/namespace.model'
import { Menu } from './models/menu.model'
import { LifeEventPage } from './models/lifeEventPage.model'

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
  lang = 'is-IS',
): Promise<AdgerdirFrontpage> => {
  const result = await getLocalizedEntries<types.IVidspyrnaFrontpageFields>(
    lang,
    {
      ['content_type']: 'vidspyrna-frontpage',
      include: 10,
    },
  ).catch(errorHandler('getVidspyrnaFrontpage'))

  return result.items.map(mappers.mapAdgerdirFrontpage)[0] ?? null
}

export const getAdgerdirPages = async (
  lang = 'is-IS',
): Promise<AdgerdirPages> => {
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
    items: result.items.map(mappers.mapAdgerdirPage),
  }
}

export const getAdgerdirTags = async (lang = 'is-IS') => {
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
    items: r.items.map(mappers.mapAdgerdirTag),
  }
}

export const getFrontpageSliderList = async (lang = 'is-IS') => {
  const params = {
    ['content_type']: 'frontpageSliderList',
    include: 10,
    limit: 1,
  }

  const result = await getLocalizedEntries<types.IFrontpageSliderListFields>(
    lang,
    params,
  ).catch(errorHandler('getFrontpageSliderList'))

  return result.items.map(mappers.mapFrontpageSliderList)[0] ?? null
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

  return result.items.map(mappers.mapAdgerdirPage)[0] ?? null
}

export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article | null> => {
  const result = await getLocalizedEntries<types.IArticleFields>(lang, {
    ['content_type']: 'article',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getArticle'))

  return result.items.map(mappers.mapArticle)[0]
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

  return result.items.map(mappers.mapNewsItem)[0] ?? null
}

export const getNewsList = async ({
  lang = 'is-IS',
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
    news: result.items.map(mappers.mapNewsItem),
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

  return result.items.map(mappers.mapAboutPage)[0] ?? null
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

  return result.items.map(mappers.mapLandingPage)[0] ?? null
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

  return result.items.map(mappers.mapGenericPage)[0] ?? null
}

export const getNamespace = async (
  namespace: string,
  lang: string,
): Promise<Namespace | null> => {
  const result = await getLocalizedEntries<types.IUiConfigurationFields>(lang, {
    ['content_type']: 'uiConfiguration',
    'fields.namespace': namespace,
  }).catch(errorHandler('getNamespace'))

  return result.items.map(mappers.mapNamespace)[0] ?? null
}

export const getMenu = async (
  name: string,
  lang: string,
): Promise<Menu | null> => {
  const result = await getLocalizedEntries<types.IMenuFields>(lang, {
    ['content_type']: 'menu',
    'fields.title': name,
  }).catch(errorHandler('getMenu'))

  return result.items.map(mappers.mapMenu)[0] ?? null
}

export const getLifeEventPage = async (
  slug: string,
  lang: string,
): Promise<LifeEventPage | null> => {
  const result = await getLocalizedEntries<types.IMenuFields>(lang, {
    ['content_type']: 'lifeEventPage',
    'fields.slug': slug,
  }).catch(errorHandler('getLifeEventPage'))

  return result.items.map(mappers.mapLifeEventPage)[0] ?? null
}
