import { ApolloServerPluginCacheControl } from 'apollo-server-core'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { Inject, Injectable, Optional } from '@nestjs/common'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { createRedisApolloCache } from '@island.is/cache'
import type { ConfigType } from '@island.is/nest/config'
import {
  GRAPHQL_CACHE_KEY_PROVIDERS,
  GraphqlCacheKeyProvider,
  matchesCacheKeyProvider,
} from '@island.is/nest/graphql'
import { getConfig } from './environments'
import { GraphQLConfig } from './graphql.config'
import { maskOutFieldsMiddleware } from './graphql.middleware'

@Injectable()
export class GraphqlOptionsFactory implements GqlOptionsFactory {
  constructor(
    @Inject(GraphQLConfig.KEY)
    private readonly config: ConfigType<typeof GraphQLConfig>,
    @Optional()
    @Inject(GRAPHQL_CACHE_KEY_PROVIDERS)
    private readonly cacheKeyProviders: GraphqlCacheKeyProvider[] = [],
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
          ? createRedisApolloCache({
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
          extraCacheKeyData: async (requestContext) => {
            const opName = requestContext.request.operationName ?? ''
            const query = requestContext.request.query ?? ''
            for (const provider of this.cacheKeyProviders) {
              if (matchesCacheKeyProvider(provider, opName, query)) {
                return await provider.getCacheKeyData(requestContext)
              }
            }
            return ''
          },
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
        overrideCacheControlPlugin(this.cacheKeyProviders),
      ],
    }
  }
}

function overrideCacheControlPlugin(
  cacheKeyProviders: GraphqlCacheKeyProvider[] = [],
): ApolloServerPlugin {
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
            const opName = requestContext.request.operationName ?? ''
            const query = requestContext.request.query ?? ''
            const hasCustomCacheKey = cacheKeyProviders.some((p) =>
              matchesCacheKeyProvider(p, opName, query),
            )

            // Make sure X-Bypass-Cache gets past browser and CDN caches.
            response.http.headers.set('Vary', 'Accept-Encoding, X-Bypass-Cache')

            if (hasCustomCacheKey) {
              // Operations with server-side cache key splits (e.g. feature flags)
              // must not be cached by CDN/browser, since those caches cannot
              // distinguish between cohorts. The Redis-level responseCachePlugin
              // still caches them with the correct split key.
              response.http.headers.set(
                'Cache-Control',
                `private, max-age=${policyIfCacheable.maxAge}`,
              )
            } else {
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
          }
        },
      }
    },
  }
}
