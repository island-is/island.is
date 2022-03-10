import { Request } from 'express'

import { Auth } from './auth'
import { User } from './user'

export type GraphQLContext = {
  req: Request & {
    auth?: Auth
    user?: User
  }
}
