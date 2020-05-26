export {
  routes as authRoutes,
  verifyToken,
  AuthContext,
  ACCESS_TOKEN_COOKIE,
} from './auth'

import {
  resolvers as applicationResolvers,
  typeDefs as applicationTypeDefs,
} from './applications'

export const resolvers = [applicationResolvers]

export const typeDefs = [applicationTypeDefs]
