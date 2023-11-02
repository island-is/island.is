import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType } from '@island.is/nest/config'
import { UserProfileApi, Configuration } from '../../gen/fetch'

import { UserProfileClientConfig } from './userProfileClient.config'
import { createRedisCacheManager } from '@island.is/cache'

export const UserProfileApiProvider = {
  provide: UserProfileApi,
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (config: ConfigType<typeof UserProfileClientConfig>) => {
    const cache =
      config.redis.nodes.length === 0
        ? undefined
        : {
            cacheManager: await createRedisCacheManager({
              name: 'clients-user-profile',
              nodes: config.redis.nodes,
              ssl: config.redis.ssl,
              noPrefix: true,
              ttl: 0,
            }),
            shared: false,
            overrideCacheControl: config.cacheControl,
          }

    return new UserProfileApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-user-profile',
          organizationSlug: 'stafraent-island',
          cache,
        }),
        basePath: config.basePath,
      }),
    )
  },
  inject: [UserProfileClientConfig.KEY],
}
