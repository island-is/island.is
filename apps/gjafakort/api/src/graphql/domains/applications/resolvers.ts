import { Resolvers } from '../../../types'
import { getApplication, createApplication } from './service'

const resolvers: Resolvers = {
  Mutation: {
    async createApplication(_, args, context) {
      const { channel, appExchangeId } = context
      const application = await createApplication(args.input)
      if (application.state === 'approved') {
        channel.publish({
          exchangeId: appExchangeId,
          message: application,
          routingKey: application.state,
        })
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
