import { Resolvers } from '@island.is/api/schema'
import { getArticle } from './services'

export const resolvers: Resolvers = {
  Query: {
    article (_, { input }) {
      return getArticle(input?.id ?? '')
    },
  },
}

export default resolvers
