import {
  buildCacheControl,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import {
  ConfigType,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'
import { RskRentalDayRateClientConfig } from './RskRentalDayRateClientConfig'

import { createRedisCacheManager } from '@island.is/cache'

export const RskRentalDayRateConfigurationProvider = {
  provide: Configuration,
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof RskRentalDayRateClientConfig>,
    xRoadConfig: ConfigType<typeof XRoadConfig>,
    idsClientConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
    return new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-rental-day-rate',
        organizationSlug: 'skatturinn',
        cache:
          config.redis.nodes.length === 0
            ? undefined
            : {
                cacheManager: await createRedisCacheManager({
                  name: 'clients-rental-day-rate',
                  nodes: config.redis.nodes,
                  ssl: config.redis.ssl,
                  noPrefix: true,
                  ttl: 0,
                }),
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
    RskRentalDayRateClientConfig.KEY,
    XRoadConfig.KEY,
    IdsClientConfig.KEY,
  ],
}
