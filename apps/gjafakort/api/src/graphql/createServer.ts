import { ApolloServer } from 'apollo-server-express'
import { RedisCache } from 'apollo-server-cache-redis'
import { DocumentNode } from 'graphql'
import merge from 'lodash/merge'

import MessageQueue from '@island.is/message-queue'
import { logger } from '@island.is/logging'

import { environment } from '../environments'
import { verifyToken, ACCESS_TOKEN_COOKIE } from '../domains'
import { Resolvers, GraphQLContext, DataSource } from '../types'
import { ApplicationAPI, FerdalagAPI, RskAPI } from '../services'
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

  const channel = await MessageQueue.connect(production)
  const context = {
    messageQueue: {
      channel,
      appExchangeId: await channel.declareExchange({
        name: applicationExchange,
      }),
    },
  }

  return new ApolloServer({
    resolvers: fooresolvers,
    typeDefs: [rootTypeDefs, ...typeDefs],
    playground: enablePlayground,
    introspection: enablePlayground,
    cache: new RedisCache({
      host: environment.redis.url,
      port: 6379,
      password: environment.redis.password,
      name: 'gjafakort_api_service_cache',
      connectTimeout: 5000,
      reconnectOnError: (err) => {
        logger.error(`Reconnect on error: ${err}`)
        var targetError = 'READONLY'
        if (err.message.slice(0, targetError.length) === targetError) {
          // Only reconnect when the error starts with "READONLY"
          return true
        }
      },
      retryStrategy: (times) => {
        logger.info(`Redis Retry: ${times}`)
        if (times >= 3) {
          return undefined
        }
        var delay = Math.min(times * 50, 2000)
        return delay
      },
      socket_keepalive: false,
    }),
    dataSources: (): DataSource => ({
      applicationApi: new ApplicationAPI(),
      ferdalagApi: new FerdalagAPI(),
      rskApi: new RskAPI(),
    }),
    context: ({ req }): GraphQLContext => {
      const accessToken = req.cookies[ACCESS_TOKEN_COOKIE.name]
      if (!accessToken) {
        return context
      }

      const credentials = verifyToken(accessToken)
      if (!credentials) {
        logger.error('signature validation failed')
        return context
      }

      const { csrfToken, user } = credentials
      if (csrfToken && `Bearer ${csrfToken}` !== req.headers.authorization) {
        logger.error('invalid csrf token')
        return context
      }

      return { ...context, user }
    },
  })
}

export default createServer
