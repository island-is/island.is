import { ConfigType } from '@island.is/nest/config'
import { createRedisCacheManager } from '@island.is/cache'
import {
  buildCacheControl,
  CacheConfig,
  Request,
} from '@island.is/clients/middlewares'

import { CmsConfig } from './cms.config'

const overrideCacheControl = (_request: Request) => {
  return buildCacheControl({
    maxAge: 10 * 60, // 10 minutes
    public: true, // required to enable caching for contentful gql
  })
}

export const getCache = async (
  config: ConfigType<typeof CmsConfig>,
): Promise<CacheConfig | undefined> => {
  if (config.redis.nodes.length === 0) {
    console.warn('No redis nodes defined, cache will not be used')
    return undefined
  }
  const cacheManager = await createRedisCacheManager({
    name: 'cms',
    nodes: config.redis.nodes,
    ssl: config.redis.ssl,
    noPrefix: true,
    ttl: 0,
  })

  return {
    cacheManager,
    cacheKey: (request: Request) => request.url,
    shared: true,
    overrideCacheControl,
  }
}
