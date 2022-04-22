import {
  buildCacheControl,
  CacheConfig,
  createEnhancedFetch,
} from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { UserProfileApi, Configuration } from '../../gen/fetch'

import { UserProfileClientConfig } from './userProfileClient.config'
import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { createRedisCluster } from '@island.is/cache'

export const UserProfileApiProvider = {
  provide: UserProfileApi,
  useFactory: (config: ConfigType<typeof UserProfileClientConfig>) => {
    const cache =
      config.redis.nodes.length === 0
        ? undefined
        : {
            cacheManager: caching({
              store: redisStore,
              ttl: 0,
              redisInstance: createRedisCluster({
                name: 'clients-user-profile',
                nodes: config.redis.nodes,
                ssl: config.redis.ssl,
                noPrefix: true,
              }),
            }),
            shared: false,
            overrideCacheControl: config.cacheControl,
          }

    return new UserProfileApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-user-profile',
          cache,
        }),
        basePath: config.basePath,
      }),
    )
  },
  inject: [UserProfileClientConfig.KEY],
}
