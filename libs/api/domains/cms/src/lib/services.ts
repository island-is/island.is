import { getLocalizedEntries } from './contentful'
import { logger } from '@island.is/logging'
import { Entry } from 'contentful'
import { Image, Article, News } from '@island.is/api/schema'

interface Taxonomy {
  title: string
  slug: string
  description: string
}

interface CmsArticle {
  id: string
  slug: string
  title: string
  content: string
  group: Entry<Taxonomy>
  category: Entry<Taxonomy>
}

const extractArticle = (article: any): Article => {
  return {
    id: article.sys.id,
    slug: article.fields.slug,
    title: article.fields.title,
    group: article.fields.group?.fields,
    category: article.fields.category?.fields,
    content: JSON.stringify(article.fields.content),
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
    throw new Error('Failed to resolve request in getArticle')
  })

  if (!result.total) {
    throw new Error(`Article ${slug} not found`)
  }

  return extractArticle(result.items[0])
}

const formatImage = ({ fields }): Image => ({
  url: fields.file.url,
  title: fields.title,
  filename: fields.file.fileName,
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

export const getNews = async (lang: string, slug: string) => {
  const r = await getLocalizedEntries<News>(lang, {
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
  offset: number,
  limit: number,
) => {
  const params = {
    content_type: 'news',
    include: 10,
    order: (ascending ? '' : '-') + 'fields.date',
    skip: offset,
    limit,
  }

  if (year) {
    params['fields.date[gte]'] = new Date(year, month ?? 0, 1)
    params['fields.date[lt]'] =
      month != undefined
        ? new Date(year, month + 1, 1)
        : new Date(year + 1, 0, 1)
  }

  const r = await getLocalizedEntries<News>(lang, params)
  return r.items.map(formatNewsItem)
}

interface Namespace {
  namespace: string
  fields: string
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
    throw new Error('Failed to resolve request in getNamespace')
  })

  if (!result.total) {
    throw new Error(`${namespace} not found in namespaces`)
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
