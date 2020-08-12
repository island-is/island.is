import { Resolvers } from '@island.is/api/schema'
import {
  getArticle,
  getNews,
  getNewsList,
  getNamespace,
  getAboutPage,
  getLandingPage,
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
    getAboutPage(_, { input }) {
      return getAboutPage(input)
    },
    getLandingPage(_, { input }) {
      return getLandingPage(input)
    },
  },

  Slice: {
    __resolveType: (obj) => obj.__typename,
  },

  LatestNewsSlice: {
    news: async () => {
      const { news } = await getNewsList({ perPage: 3, lang: 'is' })
      return news
    },
  },
}

export default resolvers
