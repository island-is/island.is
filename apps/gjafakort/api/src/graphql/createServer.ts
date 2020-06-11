import { ApolloServer } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import merge from 'lodash/merge'

import { logger } from '@island.is/logging'
// import { createCache } from '@island.is/cache'

import { environment } from '../environments'
import { verifyToken, ACCESS_TOKEN_COOKIE } from '../domains'
import { Resolvers, GraphQLContext, DataSource } from '../types'
import { ApplicationAPI, FerdalagAPI, RskAPI } from '../services'
import rootTypeDefs from './typeDefs'

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

  return new ApolloServer({
    resolvers: fooresolvers,
    typeDefs: [rootTypeDefs, ...typeDefs],
    playground: enablePlayground,
    introspection: enablePlayground,
    // cache: createCache({
    //   host: environment.redis.url,
    //   port: 6379,
    //   name: 'gjafakort_api_service_cache',
    // }),
    dataSources: (): DataSource => ({
      applicationApi: new ApplicationAPI(),
      ferdalagApi: new FerdalagAPI(),
      rskApi: new RskAPI(),
    }),
    context: ({ req }): GraphQLContext => {
      const accessToken = req.cookies[ACCESS_TOKEN_COOKIE.name]
      if (!accessToken) {
        return {}
      }

      const credentials = verifyToken(accessToken)
      if (!credentials) {
        logger.error('signature validation failed')
        return {}
      }

      const { csrfToken, user } = credentials
      if (csrfToken && `Bearer ${csrfToken}` !== req.headers.authorization) {
        logger.error('invalid csrf token')
        return {}
      }

      return { user }
    },
  })
}

export default createServer
