import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import merge from 'lodash/merge'

import { verifyToken } from '../api/domains/auth/utils'
import { AuthContext } from '../api/domains/auth/types'
import { CSRF_COOKIE, ACCESS_TOKEN_COOKIE } from '../api/domains/auth/consts'
import rootTypeDefs from './typeDefs'
import domains from './domains'

const resolvers = domains.reduce(
  (combinedDomains, currentDomain) =>
    merge(currentDomain.resolvers, combinedDomains),
  {},
)

const typeDefs = [rootTypeDefs, ...domains.map((domain) => domain.typeDefs)]

const createServer = (app: Express) => {
  const enablePlayground =
    process.env.NODE_ENV === 'development' ||
    process.env.GQL_PLAYGROUND_ENABLED === '1'

  const server = new ApolloServer({
    resolvers,
    typeDefs,
    playground: enablePlayground,
    introspection: enablePlayground,
    context: ({ req }): AuthContext | null => {
      const accessToken = req.cookies[ACCESS_TOKEN_COOKIE.name]
      if (!accessToken) {
        return null
      }

      const credentials = verifyToken(accessToken)
      if (!credentials) {
        console.error('signature validation failed')
        return null
      }

      const { csrfToken, user } = credentials
      if (csrfToken && `Bearer ${csrfToken}` !== req.headers.authorization) {
        console.error('invalid csrf token')
        return null
      }

      return { user }
    },
  })

  server.applyMiddleware({ app, path: '/api' })
}

export default createServer
