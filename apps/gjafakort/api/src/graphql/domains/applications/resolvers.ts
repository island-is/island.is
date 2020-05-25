import { Resolvers } from '../../../types'
import { authorize } from '../../../api'
import { AuthContext } from '../../../api/domains/auth/types'

class ApplicationResolver {
  @authorize({ role: 'admin' })
  public getApplication(root, args, { user }: AuthContext) {
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
