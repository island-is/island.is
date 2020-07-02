import { getLocalizedEntries } from './contentful'
import { logger } from '@island.is/logging'
import { Entry } from 'contentful'
import { Article } from '@island.is/api/schema'
import { ApolloError } from 'apollo-server-express'

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
export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article> => {
  const result = await getLocalizedEntries<CmsArticle>(lang, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    content_type: 'article',
    'fields.slug': slug,
    include: 10,
  }).catch((error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in getArticle')
  })

  if (!result.total) {
    throw new ApolloError(`Article ${slug} not found`, 'NOT_FOUND')
  }

  const [
    {
      sys: { id },
      fields: {
        title,
        content,
        group: { fields: groupFields } = { fields: null },
        category: { fields: categoryFields },
      },
    },
  ] = result.items

  return {
    id,
    slug,
    title,
    group: groupFields,
    category: categoryFields,
    content: JSON.stringify(content),
  }
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
    throw new ApolloError('Failed to resolve request in getNamespace')
  })

  if (!result.total) {
    throw new ApolloError(`${namespace} not found in namespaces`, 'NOT_FOUND')
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
