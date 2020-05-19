import { Resolvers } from '../../../types'
import { getApplication, createApplication } from './service'

const resolvers: Resolvers = {
  Mutation: {
    async createApplication(_, args) {
      return {
        application: await createApplication(args.input),
      }
    },
  },
  Query: {
    getApplication(_, args) {
      return getApplication(args.ssn)
    },
  },
}

export default resolvers
