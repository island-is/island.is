import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    // @ts-ignore
    getSearchResults(_, { query }, context) {
      return context.searcher.find(query)
    },
    // @ts-ignore
    getSingleItem(_, { input }, context) {
      return context.searcher.fetchSingle(input)
    },
    // @ts-ignore
    getCategories(_, { input }, context) {
      return context.searcher.fetchSingle(input)
    }
  },
}

export default resolvers
