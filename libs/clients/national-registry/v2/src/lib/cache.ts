import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { ConfigType } from '@island.is/nest/config'
import { createRedisCluster } from '@island.is/cache'
import {
  buildCacheControl,
  CacheConfig,
  Request,
} from '@island.is/clients/middlewares'

import { NationalRegistryClientConfig } from './nationalRegistryClient.config'

const registryEndpoint = /\/einstaklingar\/\d{10}$/

function shared(request: Request) {
  return !!request.url.match(registryEndpoint)
}

function overrideCacheControl(request: Request) {
  if (request.url.match(registryEndpoint)) {
    // Main registry lookup. Long cache with lazy revalidation.
    return buildCacheControl({
      public: true,
      maxAge: 60 * 60 * 24, // 1 day
      staleWhileRevalidate: 60 * 60 * 24 * 30, // 30 days
    })
  }
  // Short private cache for the rest.
  return buildCacheControl({ maxAge: 60 * 10 })
}

export const getCache = (
  config: ConfigType<typeof NationalRegistryClientConfig>,
): CacheConfig | undefined => {
  if (config.redis.nodes.length === 0) {
    return undefined
  }
  const cacheManager = caching({
    store: redisStore,
    ttl: 0,
    redisInstance: createRedisCluster({
      name: 'clients-national-registry-v2',
      nodes: config.redis.nodes,
      ssl: config.redis.ssl,
      noPrefix: true,
    }),
  })

  return {
    cacheManager,
    shared,
    overrideCacheControl,
  }
}
