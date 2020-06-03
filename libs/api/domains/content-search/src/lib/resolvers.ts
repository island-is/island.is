import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    content(_, { query }, context) {
      return context.searcher.find(query)
    },
  },
}

export default resolvers
