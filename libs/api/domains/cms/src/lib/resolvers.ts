import { Resolvers } from '@island.is/api/schema'
import {
  getArticle,
  getNews,
  getNewsList,
  getNamespace,
  getPage,
} from './services'

const richTextResolver = (source, _args, _context, info) => {
  const v = source[info.fieldName]
  return v && JSON.stringify(v)
}

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
    __resolveType: (slice) => {
      return slice.__typename
    },
  },
  LatestNewsSlice: {
    news: async () => (await getNewsList({ lang: 'is', perPage: 3 })).news,
  },
  News: {
    content: richTextResolver,
  },
  TimelineEvent: {
    body: richTextResolver,
    tags: ({ tags }) => tags ?? []
  },
  Story: {
    body: richTextResolver,
  },
}

export default resolvers
