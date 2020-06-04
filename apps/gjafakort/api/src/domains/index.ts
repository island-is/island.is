export { routes as authRoutes, verifyToken, ACCESS_TOKEN_COOKIE } from './auth'

import {
  resolvers as applicationResolvers,
  typeDefs as applicationTypeDefs,
} from './applications'
import {
  resolvers as companyResolvers,
  typeDefs as companyTypeDefs,
} from './companies'
import {
  resolvers as articleResolver,
  typeDefs as articleTypeDefs,
} from './articles'
import { resolvers as formResolver, typeDefs as formTypeDefs } from './forms'

export const resolvers = [
  applicationResolvers,
  companyResolvers,
  articleResolver,
  formResolver,
]

export const typeDefs = [
  applicationTypeDefs,
  companyTypeDefs,
  articleTypeDefs,
  formTypeDefs,
]
