import { Resolvers, Context } from '../../../types'
import { getApplication, createApplication } from './service'

const resolvers: Resolvers<Context> = {
  Mutation: {
    async createApplication(_, args, context) {
      const application = await createApplication(args.input, context)
      return { application }
    },
  },
  Query: {
    getApplication(_, args) {
      return getApplication(args.ssn)
    },
  },
}

export default resolvers
