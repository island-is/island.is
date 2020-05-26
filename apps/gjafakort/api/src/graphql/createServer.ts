import { ApolloServer } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import merge from 'lodash/merge'

import MessageQueue from '@island.is/message-queue'

import { environment } from '../environments/environment'
import { verifyToken, ACCESS_TOKEN_COOKIE } from '../domains'
import { Resolvers, GraphQLContext } from '../types'
import rootTypeDefs from './typeDefs'

const { production, applicationExchange } = environment

const createServer = async (
  resolvers: Resolvers[],
  typeDefs: DocumentNode[],
): Promise<ApolloServer> => {
  const enablePlayground =
    process.env.NODE_ENV === 'development' ||
    process.env.GQL_PLAYGROUND_ENABLED === '1'

  const fooresolvers = resolvers.reduce(
    (combinedDomains, currentDomain) => merge(currentDomain, combinedDomains),
    {},
  )

  const channel = null // TODO: await MessageQueue.connect(production)
  const context = {
    channel,
    appExchangeId:
      '' /* TODO await channel.declareExchange({
      name: applicationExchange,
    }),*/,
  }

  return new ApolloServer({
    resolvers: fooresolvers,
    typeDefs: [rootTypeDefs, ...typeDefs],
    playground: enablePlayground,
    introspection: enablePlayground,
    context: ({ req }): GraphQLContext | null => {
      const accessToken = req.cookies[ACCESS_TOKEN_COOKIE.name]
      if (!accessToken) {
        return context
      }

      const credentials = verifyToken(accessToken)
      if (!credentials) {
        console.error('signature validation failed')
        return context
      }

      const { csrfToken, user } = credentials
      if (csrfToken && `Bearer ${csrfToken}` !== req.headers.authorization) {
        console.error('invalid csrf token')
        return context
      }

      return { ...context, user }
    },
  })
}

export default createServer
