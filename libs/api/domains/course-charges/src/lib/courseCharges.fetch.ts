import { caching } from 'cache-manager'

import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import {
  buildCacheControl,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { createRedisCacheManager } from '@island.is/cache'

import { CourseChargesConfig } from './courseCharges.config'

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes
const STALE_WHILE_REVALIDATE = 24 * 60 * 60 // 24 hours (in seconds)
const STALE_IF_ERROR = 24 * 60 * 60 // 24 hours (in seconds)

const getCacheManager = async (
  config: ConfigType<typeof CourseChargesConfig>,
) => {
  if (config.redis.nodes.length === 0) {
    return caching('memory', { ttl: CACHE_TTL })
  }

  return createRedisCacheManager({
    name: 'api-course-charges',
    nodes: config.redis.nodes,
    ssl: config.redis.ssl,
    noPrefix: true,
    ttl: CACHE_TTL,
  })
}

export const COURSE_CHARGES_FETCH = 'CourseChargesEnhancedFetch'

const fetchFactory = async (config: ConfigType<typeof CourseChargesConfig>) =>
  createEnhancedFetch({
    name: 'api-course-charges',
    circuitBreaker: false,
    cache: {
      cacheManager: await getCacheManager(config),
      overrideCacheControl: () =>
        buildCacheControl({
          maxAge: CACHE_TTL / 1000,
          staleWhileRevalidate: STALE_WHILE_REVALIDATE,
          staleIfError: STALE_IF_ERROR,
          public: true,
        }),
    },
  })

export const courseChargesFetch = {
  provide: COURSE_CHARGES_FETCH,
  scope: LazyDuringDevScope,
  useFactory: (config: ConfigType<typeof CourseChargesConfig>) =>
    fetchFactory(config),
  inject: [CourseChargesConfig.KEY],
}
