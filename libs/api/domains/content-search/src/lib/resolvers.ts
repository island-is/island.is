import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    // @ts-ignore
    getSearchResults(_, { query }, context) {
      return context.searcher.find(query)
    },
    // @ts-ignore
    article(_, { input }, context) {
      return context.searcher.getArticle(input)
    }
  },
}

export default resolvers
