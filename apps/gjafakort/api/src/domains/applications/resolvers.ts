import { Resolvers } from '../../types'
import { authorize } from '../auth'
import { getApplication, createApplication } from './service'

class ApplicationResolver {
  @authorize({ role: 'admin' })
  public getApplication(_, args) {
    return { id: '1' }
    // TODO: return getApplication(args.ssn)
  }

  @authorize()
  public async createApplication(_, args, context) {
    const application = await createApplication(args.input, context)
    return { application }
  }
}

const resolver = new ApplicationResolver()
export default {
  Query: {
    application: resolver.getApplication,
  },
  Mutation: {
    createApplication: resolver.createApplication,
  },
}
