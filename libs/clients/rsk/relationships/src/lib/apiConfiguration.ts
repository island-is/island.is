import {
  buildCacheControl,
  createEnhancedFetch,
  defaultCacheKeyWithHeader,
} from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { RskRelationshipsClientConfig } from './RskRelationshipsClientConfig'

import { createRedisCacheManager } from '@island.is/cache'

export const RskRelationshipsConfigurationProvider = {
  provide: Configuration,
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof RskRelationshipsClientConfig>,
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rsk-relationships',
        organizationSlug: 'skatturinn',
        cache:
          config.redis.nodes.length === 0
            ? undefined
            : {
                cacheManager: await createRedisCacheManager({
                  name: 'clients-rsk-relationships',
                  nodes: config.redis.nodes,
                  ssl: config.redis.ssl,
                  noPrefix: true,
                  ttl: 0,
                }),
                cacheKey: defaultCacheKeyWithHeader('X-Param-National-Id'),
                shared: false,
                overrideCacheControl: buildCacheControl({ maxAge: 60 * 10 }),
              },
        autoAuth: idsClientConfig.isConfigured
          ? {
              mode: 'tokenExchange',
              issuer: idsClientConfig.issuer,
              clientId: idsClientConfig.clientId,
              clientSecret: idsClientConfig.clientSecret,
              scope: config.tokenExchangeScope,
              tokenExchange: {
                requestActorToken: config.requestActorToken,
              },
            }
          : undefined,
      }),
      basePath: `${xRoadConfig.xRoadBasePath}/r1/${config.xRoadServicePath}`,
      headers: {
        'X-Road-Client': xRoadConfig.xRoadClient,
      },
    })
  },
  inject: [
    RskRelationshipsClientConfig.KEY,
    XRoadConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
