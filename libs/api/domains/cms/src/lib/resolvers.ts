import { Resolvers } from '@island.is/api/schema'
import { getArticle, getNamespace } from './services'

export const resolvers: Resolvers = {
  Query: {
    getArticle(_, { input }) {
      return getArticle(input?.slug ?? '', input?.lang ?? 'is-IS')
    },
    getNamespace(_, { input }) {
      return getNamespace(input?.namespace ?? '', input?.lang ?? 'is-IS')
    },
  },
}

export default resolvers
