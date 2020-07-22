import { getLocalizedEntries } from './contentful'
import { logger } from '@island.is/logging'
import {
  Image,
  Article,
  News,
  Namespace,
  Pagination,
  Timeline,
  Story,
} from '@island.is/api/schema'
import { ApolloError } from 'apollo-server-express'

const formatArticle = ({ sys, fields }): Article => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  group: fields.group?.fields,
  category: fields.category?.fields,
  content: JSON.stringify(fields.content),
})

const formatImage = ({ fields }): Image => ({
  url: fields.file.url,
  title: fields.title,
  contentType: fields.file.contentType,
  width: fields.file.details.image.width,
  height: fields.file.details.image.height,
})

const formatNewsItem = ({ fields, sys }): News => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  intro: fields.intro,
  image: formatImage(fields.image),
  date: fields.date,
  content: JSON.stringify(fields.content),
})

const formatTimeline = ({ fields, sys }): Timeline => ({
  id: sys.id,
  title: fields.title,
  date: fields.date,
  numerator: fields.numerator,
  denominator: fields.denominator,
  label: fields.label ?? '',
  body: fields.body && JSON.stringify(fields.body),
  tags: fields.tags ?? [],
  link: fields.link ?? '',
})

const formatStory = ({ fields, sys }): Story => ({
  title: fields.title ?? '',
  label: fields.label ?? '',
  date: sys.createdAt,
  logo: formatImage(fields.logo),
  intro: fields.intro,
  body: fields.body && JSON.stringify(fields.body),
})

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
    throw new Error('Failed to resolve request in ' + name)
  }
}

export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article> => {
  const result = await getLocalizedEntries<Article>(lang, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    content_type: 'article',
    'fields.slug': slug,
    include: 10,
  }).catch((error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in getArticle')
  })

  // if we have no results
  if (!result.total) {
    return null
  }

  return formatArticle(result.items[0])
}

export const getNews = async (lang: string, slug: string) => {
  const r = await getLocalizedEntries<News>(lang, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    content_type: 'news',
    include: 10,
    'fields.slug': slug,
  }).catch((error) => {
    logger.error(error)
    throw new Error('Failed to resolve request in getArticle')
  })

  return r.items[0] && formatNewsItem(r.items[0])
}

export const getNewsList = async (
  lang: string,
  year: number,
  month: number,
  ascending: boolean,
  page = 1,
  perPage = 10,
) => {
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

  const r = await getLocalizedEntries<News>(lang, params).catch((error) => {
    logger.error(error)
    throw new Error('Failed to resolve request in getNewsList')
  })

  return {
    page: makePage(page, perPage, r.total),
    news: r.items.map(formatNewsItem),
  }
}

export const getTimeline = async () => {
  const result = await getLocalizedEntries<Timeline>('is', {
    ['content_type']: 'timeline',
    include: 0,
    order: 'fields.date',
    limit: 1000,
  }).catch(errorHandler('getTimeline'))

  return result.items.map(formatTimeline)
}

export const getStories = async (lang: string) => {
  const result = await getLocalizedEntries<Story>(lang, {
    ['content_type']: 'story',
    include: 1,
  }).catch(errorHandler('getStories'))

  return result.items.map(formatStory)
}

export const getNamespace = async (
  namespace: string,
  lang: string,
): Promise<Namespace> => {
  const result = await getLocalizedEntries<Namespace>(lang, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    content_type: 'uiConfiguration',
    'fields.namespace': namespace,
  }).catch((error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in getNamespace')
  })

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
