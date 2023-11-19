import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { createRedisCacheManager } from '@island.is/cache'
import { StatisticsClientConfig } from './statistics.config'
import { ConfigType } from '@island.is/nest/config'

const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

const fetchFactory = async (
  config: ConfigType<typeof StatisticsClientConfig>,
) =>
  createEnhancedFetch({
    name: 'statistics-source-fetcher',
    cache: {
      cacheManager: await createRedisCacheManager({
        name: 'clients-statistics',
        nodes: config.redis.nodes,
        ssl: config.redis.ssl,
        noPrefix: true,
        ttl: CACHE_TTL,
      }),
    },
  })

export const FetchWithCache = 'EnhancedFetch'

export const enhancedFetch = {
  provide: FetchWithCache,
  useFactory: fetchFactory,
  inject: [StatisticsClientConfig.KEY],
}
