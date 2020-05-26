import { ApolloServer } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import merge from 'lodash/merge'

import { verifyToken, AuthContext, ACCESS_TOKEN_COOKIE } from '../domains'
import { Resolvers } from '../types'
import rootTypeDefs from './typeDefs'

const createServer = (
  resolvers: Resolvers[],
  typeDefs: DocumentNode[],
): ApolloServer => {
  const enablePlayground =
    process.env.NODE_ENV === 'development' ||
    process.env.GQL_PLAYGROUND_ENABLED === '1'

  return new ApolloServer({
    resolvers: resolvers.reduce((acc, resolver) => merge(resolver, acc)),
    typeDefs: [rootTypeDefs, ...typeDefs],
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
}

export default createServer
