// import fetch from 'isomorphic-unfetch'
import { EntryCollection } from 'contentful'
import { getLocalizedEntries } from './contentful'

interface Article {
  id: string
  title: string
  content: string
}

export type RawArticle = EntryCollection<Article>

export const getArticle = (id: string) => ({
  id,
  title: 'Forsíða',
  content: 'Text and some text',
})

export const getArticleById = async (entryId: string): Promise<Article> => {
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
