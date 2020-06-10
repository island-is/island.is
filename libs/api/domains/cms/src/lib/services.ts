import { EntryCollection } from 'contentful'
import { getLocalizedEntries } from './contentful'

interface Article {
  id: string
  title: string
  content: string
}

export type RawArticle = EntryCollection<Article>

export const getArticle = async (entryId: string): Promise<Article> => {
  let result: RawArticle | null = null

  try {
    result = await getLocalizedEntries('is-IS', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: 'article',
      'sys.id': entryId,
      include: 10,
    })
  } catch (e) {
    return null
  }

  const article = result.items[0]

  const { id } = article.sys
  const { title, content } = article.fields

  return {
    id,
    title,
    content: JSON.stringify(content) || '',
  }
}
interface Namespace {
  namespace: string
  fields: string
}

export type RawNamespace = EntryCollection<Namespace>

export const getNamespace = async (namespace: string): Promise<Namespace> => {
  let result: RawNamespace | null = null

  try {
    result = await getLocalizedEntries('is-IS', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_type: 'uiConfiguration',
      'fields.namespace': namespace,
    })
  } catch (e) {
    return null
  }

  const { fields } = result?.items[0] || null

  return {
    namespace,
    fields: JSON.stringify(fields) || '',
  }
}
