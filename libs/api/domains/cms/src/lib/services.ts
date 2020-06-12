import { EntryCollection } from 'contentful'
import { getLocalizedEntries } from './contentful'

interface Article {
  id: string
  slug: string
  title: string
  content: string
}

export type RawArticle = EntryCollection<Article>

export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article> => {
  let result: RawArticle | null = null

  try {
    result = await getLocalizedEntries(lang, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: 'article',
      'fields.slug': slug,
      include: 10,
    })
  } catch (e) {
    return null
  }

  if (!result.items.length) {
    return null
  }

  const article = result.items[0]

  const { id } = article.sys
  const { title, content } = article.fields

  return {
    id,
    slug,
    title,
    content: JSON.stringify(content) || '',
  }
}

interface Namespace {
  namespace: string
  fields: string
}

export type RawNamespace = EntryCollection<Namespace>

export const getNamespace = async (
  namespace: string,
  lang: string,
): Promise<Namespace> => {
  let result: RawNamespace | null = null

  try {
    result = await getLocalizedEntries(lang, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: 'uiConfiguration',
      'fields.namespace': namespace,
    })
  } catch (e) {
    return null
  }

  if (!result.items.length) {
    return null
  }

  const { fields } = result?.items[0]

  return {
    namespace,
    fields: JSON.stringify(fields) || '',
  }
}
