import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    searcher(_, { input }, context) {
      const message = context.searcher.getMessage(input?.name ?? 'World')
      return { message }
    },
  },
}

export default resolvers
