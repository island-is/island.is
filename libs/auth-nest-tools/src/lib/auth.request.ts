import { Request as ExpressRequest } from 'express'

import { Auth } from './auth'
import { User } from './user'

export type AuthRequest = ExpressRequest & {
  auth?: Auth
  user?: User
}
