import { Resolvers } from '../../../types'
import { getApplication, createApplication } from './service'
import { publishMessage } from '../../../services/sns'

const resolvers: Resolvers = {
  Mutation: {
    async createApplication(_, args) {
      const application = await createApplication(args.input)
      if (application.state === 'approved') {
        publishMessage(application)
      }
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
