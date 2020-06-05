import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    // @ts-ignore
    search(_, { query }, context) {
      return context.searcher.find(query)
    },
    article(_, { input }, context) {
      return context.searcher.getArticle(input)
    }
  },
}

export default resolvers
