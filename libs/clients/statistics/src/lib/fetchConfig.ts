import { caching } from 'cache-manager'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { createRedisCacheManager } from '@island.is/cache'
import { StatisticsClientConfig } from './statistics.config'
import { ConfigType } from '@island.is/nest/config'

const getCacheManager = async (
  config: ConfigType<typeof StatisticsClientConfig>,
) => {
  if (config.redis.nodes.length === 0) {
    // Fall back to in-memory cache if redis is not configured
    return caching('memory', { ttl: config.redis.cacheTtl })
  }

  return createRedisCacheManager({
    name: 'clients-statistics',
    nodes: config.redis.nodes,
    ssl: config.redis.ssl,
    noPrefix: true,
    ttl: config.redis.cacheTtl,
  })
}

const fetchFactory = async (
  config: ConfigType<typeof StatisticsClientConfig>,
) =>
  createEnhancedFetch({
    name: 'clients-statistics',
    cache: {
      cacheManager: await getCacheManager(config),
    },
  })

export const FetchWithCache = 'EnhancedFetch'

export const enhancedFetch = {
  provide: FetchWithCache,
  useFactory: fetchFactory,
  inject: [StatisticsClientConfig.KEY],
}
