import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    searchResults(_, { query }, context) {
      return context.searcher.find(query)
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    singleItem(_, { input }, context) {
      return context.searcher.fetchSingle(input)
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    categories(_, { input }, context) {
      return context.searcher.fetchCategories(input)
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    articlesInCategory(_, { category }, context) {
      return context.searcher.fetchItems(category)
    },
  },
}

export default resolvers
