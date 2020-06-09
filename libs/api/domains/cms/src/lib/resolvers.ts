import { Resolvers } from '@island.is/api/schema'
import { getArticleById } from './services'

export const resolvers: Resolvers = {
  Query: {
    article(_, { input }) {
      return getArticleById(input?.id ?? '')
    },
  },
}

export default resolvers
