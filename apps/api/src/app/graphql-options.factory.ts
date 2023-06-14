import { ApolloServerPluginCacheControl } from 'apollo-server-core'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { Inject, Injectable } from '@nestjs/common'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { createRedisApolloCache } from '@island.is/cache'
import type { ConfigType } from '@island.is/nest/config'
import { getConfig } from './environments'
import { GraphQLConfig } from './graphql.config'
import { maskOutFieldsMiddleware } from './graphql.middleware'

@Injectable()
export class GraphqlOptionsFactory implements GqlOptionsFactory {
  constructor(
    @Inject(GraphQLConfig.KEY)
    private readonly config: ConfigType<typeof GraphQLConfig>,
  ) {}

  async createGqlOptions() {
    const debug = process.env.NODE_ENV === 'development'
    const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
    const autoSchemaFile = getConfig.production
      ? true
      : 'apps/api/src/api.graphql'
    const bypassCacheSecret = this.config.bypassCacheSecret

    return {
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      cache:
        this.config.redis.nodes.length > 0
          ? await createRedisApolloCache({
              name: 'apollo-cache',
              nodes: this.config.redis.nodes,
              ssl: this.config.redis.ssl,
            })
          : undefined,
      buildSchemaOptions: {
        fieldMiddleware: [maskOutFieldsMiddleware],
      },
      plugins: [
        // Cache responses in Redis.
        responseCachePlugin({
          shouldReadFromCache: ({ request: { http } }) => {
            if (!bypassCacheSecret) {
              return true
            }

            // Allow overriding the Redis cache with a special header.
            const bypassCache = http?.headers.get('X-Bypass-Cache')
            return bypassCache !== bypassCacheSecret
          },
        }),
        // This plugin is automatically added by default, but we explicitly add it here, so we can override the
        // cache-control header in the next plugin.
        ApolloServerPluginCacheControl(),
        // Override the default cache-control to use stale-while-revalidate.
        overrideCacheControlPlugin(),
      ],
    }
  }
}

function overrideCacheControlPlugin(): ApolloServerPlugin {
  return {
    async requestDidStart() {
      return {
        async willSendResponse(requestContext) {
          const { response, overallCachePolicy } = requestContext

          const policyIfCacheable = overallCachePolicy.policyIfCacheable()

          // If there is a non-trivial cache policy, there are no errors, and
          // we actually can write headers, write the header.
          if (
            policyIfCacheable &&
            policyIfCacheable.maxAge > 0 &&
            !response.errors &&
            response.http
          ) {
            // Make sure X-Bypass-Cache gets past browser and CDN caches.
            response.http.headers.set('Vary', 'Accept-Encoding, X-Bypass-Cache')

            // Store the response in CDN cache for 10% of the maxAge after which it'll be revalidated in the
            // background.
            response.http.headers.set(
              'Cache-Control',
              `s-maxage=${
                policyIfCacheable.maxAge / 10
              }, stale-while-revalidate=${
                policyIfCacheable.maxAge
              }, ${policyIfCacheable.scope.toLowerCase()}`,
            )
          }
        },
      }
    },
  }
}
