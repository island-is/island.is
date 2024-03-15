import { Article } from '@island.is/web/graphql/schema'

type ArticleWithProcessEntryType = Partial<
  Pick<Article, 'processEntry' | 'body'>
>

export const hasProcessEntries = (article: ArticleWithProcessEntryType) => {
  const hasMainProcessEntry =
    !!article.processEntry?.processTitle || !!article.processEntry?.processLink
  const hasProcessEntryInBody = !!article.body?.filter((content) => {
    return content.__typename === 'ProcessEntry'
  }).length

  return hasMainProcessEntry || hasProcessEntryInBody
}
