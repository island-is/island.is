import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { createRedisCacheManager } from '@island.is/cache'
import { StatisticsClientConfig } from './statistics.config'
import { ConfigType } from '@island.is/nest/config'

const fetchFactory = async (
  config: ConfigType<typeof StatisticsClientConfig>,
) =>
  createEnhancedFetch({
    name: 'clients-statistics',
    cache: {
      cacheManager: await createRedisCacheManager({
        name: 'clients-statistics',
        nodes: config.redis.nodes,
        ssl: config.redis.ssl,
        noPrefix: true,
        ttl: config.redis.cacheTtl,
      }),
    },
  })

export const FetchWithCache = 'EnhancedFetch'

export const enhancedFetch = {
  provide: FetchWithCache,
  useFactory: fetchFactory,
  inject: [StatisticsClientConfig.KEY],
}
