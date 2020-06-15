export { routes as authRoutes, verifyToken, ACCESS_TOKEN_COOKIE } from './auth'

import {
  resolvers as companyResolvers,
  typeDefs as companyTypeDefs,
} from './companies'
import { resolvers as userResolver, typeDefs as userTypeDefs } from './users'

export const resolvers = [companyResolvers, userResolver]

export const typeDefs = [companyTypeDefs, userTypeDefs]
