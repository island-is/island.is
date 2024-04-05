import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { ConfigType, IdsClientConfig } from '@island.is/nest/config'
import { Configuration } from '../../gen/fetch'

import { UserProfileClientConfig } from './userProfileClient.config'
import { createRedisCacheManager } from '@island.is/cache'

export const ApiConfiguration = {
  provide: 'UserProfileClientApiConfiguration',
  // Necessary because of cache-manager.
  // eslint-disable-next-line local-rules/no-async-module-init
  useFactory: async (
    config: ConfigType<typeof UserProfileClientConfig>,
    idsConfig: ConfigType<typeof IdsClientConfig>,
  ) => {
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

    return new Configuration({
      basePath: config.basePath,
      fetchApi: createEnhancedFetch({
        name: 'clients-user-profile',
        organizationSlug: 'stafraent-island',
        cache,
        autoAuth: idsConfig.isConfigured
          ? {
              issuer: idsConfig.issuer,
              clientId: idsConfig.clientId,
              clientSecret: idsConfig.clientSecret,
              scope: config.scope,
              mode: 'auto',
            }
          : undefined,
      }),
    })
  },
  inject: [UserProfileClientConfig.KEY, IdsClientConfig.KEY],
}
