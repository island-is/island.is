import { Resolvers } from '@island.is/api/schema'
import { getArticle, getNamespace } from './services'

export const resolvers: Resolvers = {
  Query: {
    getArticle(_, { input }) {
      return getArticle(input?.id ?? '')
    },
    getNamespace(_, { input }) {
      return getNamespace(input?.namespace ?? '')
    },
  },
}

export default resolvers
