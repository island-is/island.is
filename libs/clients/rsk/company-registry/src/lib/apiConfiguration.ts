import { createEnhancedFetch, Request } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from './gen/fetch'
import { CompanyRegistryConfig } from './company-registry.config'
import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { createRedisCluster } from '@island.is/cache'

const registryEndpoint = /\d{10}$/

export const ApiConfiguration = {
  provide: 'CompanyRegistryClientApiConfiguration',
  useFactory: (
    config: ConfigType<typeof CompanyRegistryConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) => {
    const cache =
      config.redis.nodes.length === 0
        ? undefined
        : {
            cacheManager: caching({
              store: redisStore,
              ttl: 0,
              redisInstance: createRedisCluster({
                name: 'clients-company-registry',
                nodes: config.redis.nodes,
                ssl: config.redis.ssl,
                noPrefix: true,
              }),
            }),
            overrideCacheControl: (request: Request) => {
              // Only cache company lookups. Not search.
              if (request.url.match(registryEndpoint)) {
                return config.cacheControl
              }
            },
          }

    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rsk-company-info',
        logErrorResponseBody: true,
        cache,
      }),
      basePath: `${xroadConfig.xRoadBasePath}/r1/${config.xRoadProviderId}`,
      headers: {
        Accept: 'application/json',
        'X-Road-Client': xroadConfig.xRoadClient,
      },
    })
  },
  inject: [CompanyRegistryConfig.KEY, XRoadConfig.KEY],
}
