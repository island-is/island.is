import { Resolvers } from '@island.is/api/schema'
import {
  getArticle,
  getNews,
  getNewsList,
  getNamespace,
  getPage,
} from './services'

export const resolvers: Resolvers = {
  Query: {
    getArticle(_, { input }) {
      return getArticle(input?.slug ?? '', input?.lang ?? 'is-IS')
    },
    getNews(_, { input }) {
      return getNews(input.lang ?? 'is-IS', input.slug)
    },
    getNewsList(_, { input }) {
      return getNewsList(input)
    },
    getNamespace(_, { input }) {
      return getNamespace(input?.namespace ?? '', input?.lang ?? 'is-IS')
    },
    getPage(_, { input }) {
      return getPage(input)
    },
  },

  Slice: {
    __resolveType: (obj) => obj.__typename,
  },
}

export default resolvers
