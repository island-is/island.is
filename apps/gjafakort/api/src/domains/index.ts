export { routes as authRoutes, verifyToken, ACCESS_TOKEN_COOKIE } from './auth'

import {
  resolvers as applicationResolvers,
  typeDefs as applicationTypeDefs,
} from './applications'
import {
  resolvers as companyResolvers,
  typeDefs as companyTypeDefs,
} from './companies'

export const resolvers = [applicationResolvers, companyResolvers]

export const typeDefs = [applicationTypeDefs, companyTypeDefs]
