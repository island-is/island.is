export { ACCESS_TOKEN_COOKIE,routes as authRoutes, verifyToken } from './auth'

import { resolvers as authResolvers, typeDefs as authTypeDefs } from './auth'
import {
  resolvers as commonResolvers,
  typeDefs as commonTypeDefs,
} from './common'
import {
  resolvers as companyResolvers,
  typeDefs as companyTypeDefs,
} from './companies'
import { resolvers as userResolvers, typeDefs as userTypeDefs } from './users'

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
