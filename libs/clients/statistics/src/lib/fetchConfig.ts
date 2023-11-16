import { caching } from 'cache-manager'

import { createEnhancedFetch } from '@island.is/clients/middlewares'

const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

const fetchFactory = async () => {
  return createEnhancedFetch({
    name: 'statistics-source-fetcher',
    cache: {
      cacheManager: await caching('memory', {
        ttl: CACHE_TTL,
      }),
    },
  })
}

export const FetchWithCache = 'EnhancedFetch'

export const enhancedFetch = {
  provide: FetchWithCache,
  useFactory: fetchFactory,
}
