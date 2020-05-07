import { Resolvers } from '../../../types'

const resolvers: Resolvers = {
  Query: {
    getApplication() {
      return { id: '1' }
    },
  },
}

export default resolvers
