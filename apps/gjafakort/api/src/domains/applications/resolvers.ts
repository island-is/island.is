import { Resolvers } from '../../types'
import { authorize } from '../auth'

class ApplicationResolver {
  @authorize({ role: 'admin' })
  public getApplication() {
    return { id: '1' }
  }
}

const resolver = new ApplicationResolver()

const resolvers: Resolvers = {
  Query: {
    application: resolver.getApplication,
  },
}

export default resolvers
