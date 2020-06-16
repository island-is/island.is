export { routes as authRoutes, verifyToken, ACCESS_TOKEN_COOKIE } from './auth'

import {
  resolvers as companyResolvers,
  typeDefs as companyTypeDefs,
} from './companies'
import { resolvers as userResolvers, typeDefs as userTypeDefs } from './users'
import {
  resolvers as commonResolvers,
  typeDefs as commonTypeDefs,
} from './common'
import { resolvers as authResolvers, typeDefs as authTypeDefs } from './auth'

export const resolvers = [
  companyResolvers,
  userResolvers,
  commonResolvers,
  authResolvers,
]

export const typeDefs = [
  companyTypeDefs,
  userTypeDefs,
  commonTypeDefs,
  authTypeDefs,
]
