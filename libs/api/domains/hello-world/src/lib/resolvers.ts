import { Resolvers } from '@island.is/api/schema'
import { getMessage } from './services'

export const resolvers: Resolvers = {
  Query: {
    helloWorld(_, { input }) {
      const message = getMessage(input?.name ?? 'World')
      return { message }
    },
  },
}

export default resolvers
