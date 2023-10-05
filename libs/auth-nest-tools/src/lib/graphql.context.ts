import { Request } from 'express'

import { Auth, User } from './types'

export type GraphQLContext = {
  req: Request & {
    auth?: Auth
    user?: User
  }
}
