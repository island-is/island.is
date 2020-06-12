export { routes as authRoutes, verifyToken, ACCESS_TOKEN_COOKIE } from './auth'

import {
  resolvers as companyResolvers,
  typeDefs as companyTypeDefs,
} from './companies'

export const resolvers = [companyResolvers]

export const typeDefs = [companyTypeDefs]
