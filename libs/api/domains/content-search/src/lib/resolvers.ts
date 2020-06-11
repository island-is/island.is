import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    // @ts-ignore
    searchResults(_, { query }, context) {
      return context.searcher.find(query)
    },
    // @ts-ignore
    singleItem(_, { input }, context) {
      return context.searcher.fetchSingle(input)
    },
    // @ts-ignore
    categories(_, { input }, context) {
      return context.searcher.fetchCategories(input)
    },
    // @ts-ignore
    articlesInCategory(_, { category }, context) {
      return context.searcher.fetchItems(category)
    },
  },
}

export default resolvers
