import { Article, AnchorPage, News, Resolvers } from '../../types'
import { filterItem, getTagCounts } from './utils'
import { store } from '../cms'

export const resolvers: Resolvers = {
  Items: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    webSearchAutocomplete: (parent, args) => {
      const { singleTerm, size } = args.input
      const matchedArticles = store.articles.filter((article) =>
        article.title.startsWith(singleTerm),
      )
      return {
        total: matchedArticles.length,
        completions: matchedArticles
          .slice(0, size ?? 10)
          .map((article) => article.title),
      }
    },

    searchResults: (parent, { query }) => {
      const types = query.types || ['webArticle', 'webLifeEventPage', 'webNews']

      const allItems = ([] as Array<Article | AnchorPage | News>).concat(
        ...types.map((type) => {
          switch (type) {
            case 'webArticle':
              return store.articles
            case 'webLifeEventPage':
              return store.anchorPages
            case 'webNews':
              return store.newsList
            default:
              return []
          }
        }),
      )

      const page = query.page || 1
      const perPage = query.size || 10
      const filteredItems = allItems.filter((item) => filterItem(item, query))
      const start = (page - 1) * perPage

      return {
        tagCounts: getTagCounts(filteredItems),
        total: filteredItems.length,
        items: filteredItems.slice(start, start + perPage),
      }
    },
  },
}
