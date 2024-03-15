import { createEnhancedFetch, Request } from '@island.is/clients/middlewares'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

import { Configuration } from './gen/fetch'
import { CompanyRegistryConfig } from './company-registry.config'
import { createRedisCacheManager } from '@island.is/cache'

const registryEndpoint = /\d{10}$/

export const ApiConfiguration = {
  provide: 'CompanyRegistryClientApiConfiguration',
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof CompanyRegistryConfig>,
    xroadConfig: ConfigType<typeof XRoadConfig>,
  ) => {
    const cache =
      config.redis.nodes.length === 0
        ? undefined
        : {
            cacheManager: await createRedisCacheManager({
              name: 'clients-company-registry',
              nodes: config.redis.nodes,
              ssl: config.redis.ssl,
              noPrefix: true,
              ttl: 0,
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
        organizationSlug: 'skatturinn',
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
