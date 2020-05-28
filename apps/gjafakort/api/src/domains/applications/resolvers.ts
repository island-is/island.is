import { authorize } from '../auth'
import { getApplication, createApplication } from './service'
import { ferdalagService } from '../../services'

class ApplicationResolver {
  @authorize({ role: 'admin' })
  public async getApplication(_, args) {
    const application = await getApplication(args.ssn)
    if (!application) {
      return ferdalagService.getCompany(args.ssn)
    }
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
