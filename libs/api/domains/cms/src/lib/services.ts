/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLocalizedEntries } from './contentful'
import upperFirst from 'lodash/upperFirst'
import { logger } from '@island.is/logging'
import {
  Article,
  Namespace,
  Pagination,
  GetNewsListInput,
  GetPageInput,
} from '@island.is/api/schema'
import { ApolloError } from 'apollo-server-express'
import { Entry } from 'contentful'

const TypeNameMap = {
  pageHeader: 'PageHeaderSlice',
  mailingListSignup: 'MailingListSignupSlice',
  sectionHeading: 'HeadingSlice',
  bigBulletList: 'BulletListSlice',
  cardSection: 'LinkCardSlice',
  storySection: 'StorySlice',
  timeline: 'TimelineSlice',
  numberBulletSection: 'NumberBulletGroup',
}

const flattenObject = (obj: any, acc = {}): any => {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object') {
      flattenObject(v, acc)
    } else {
      acc[k] = v
    }
  }
  return acc
}

function mapEntry(entry: Entry<any>): any {
  if (!entry) {
    return null
  }

  if (typeof entry !== 'object' || !entry.sys || !entry.fields) {
    return entry
  }

  if (entry.sys.type === 'Asset') {
    return flattenObject(entry.fields, { __typename: 'Image' })
  }

  const type = entry.sys.contentType.sys.id
  const r = {
    __typename: TypeNameMap[type] ?? upperFirst(type),
    id: entry.sys.id,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
  }

  for (const [k, _v] of Object.entries(entry.fields)) {
    const v = _v as any
    if (Array.isArray(v)) {
      r[k] = v.map(mapEntry)
    } else if (typeof v === 'object' && v.sys && v.fields) {
      r[k] = mapEntry(v as Entry<any>)
    } else {
      r[k] = v
    }
  }

  return r
}

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

export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article> => {
  const result = await getLocalizedEntries<any>(lang, {
    ['content_type']: 'article',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getArticle'))

  return mapEntry(result.items[0])
}

export const getNews = async (lang: string, slug: string) => {
  const r = await getLocalizedEntries<any>(lang, {
    ['content_type']: 'news',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getNews'))

  return mapEntry(r.items[0])
}

export const getNewsList = async ({
  lang = 'is-IS',
  year,
  month,
  ascending = false,
  page = 1,
  perPage = 10,
}: GetNewsListInput) => {
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

  const r = await getLocalizedEntries<any>(lang, params).catch(
    errorHandler('getNewsList'),
  )

  return {
    page: makePage(page, perPage, r.total),
    news: r.items.map(mapEntry),
  }
}

export const getPage = async ({ lang, slug }: GetPageInput): Promise<any> => {
  const result = await getLocalizedEntries<any>(lang, {
    ['content_type']: 'page',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getPage'))

  return mapEntry(result.items[0])
}

export const getNamespace = async (
  namespace: string,
  lang: string,
): Promise<Namespace> => {
  const result = await getLocalizedEntries<any>(lang, {
    ['content_type']: 'uiConfiguration',
    'fields.namespace': namespace,
  }).catch(errorHandler('getNamespace'))

  // if we have no results
  if (!result.total) {
    return null
  }

  const [
    {
      fields: { fields },
    },
  ] = result.items

  return {
    namespace,
    fields: JSON.stringify(fields),
  }
}
