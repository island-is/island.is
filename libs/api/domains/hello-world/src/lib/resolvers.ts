import { Resolvers } from '@island.is/api/schema'

export const resolvers: Resolvers = {
  Query: {
    helloWorld(_, { input }, context) {
      const message = context.helloWorld.getMessage(input?.name ?? 'World')
      return { message }
    },
  },
}

export default resolvers
