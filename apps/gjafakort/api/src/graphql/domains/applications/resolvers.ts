import { Resolvers } from '../../../types'
import { authorize } from '../../../api'

class ApplicationResolver {
  @authorize({ role: 'admin' })
  public getApplication() {
    return { id: '1' }
  }
}

const resolver = new ApplicationResolver()

const resolvers: Resolvers = {
  Query: {
    getApplication: resolver.getApplication,
  },
}

export default resolvers
