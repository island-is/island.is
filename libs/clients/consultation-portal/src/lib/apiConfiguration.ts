import { CasesApi, Configuration } from '../../gen/fetch'

import { ConsultationPortalClientConfig } from './consultationPortalClient.config'
import { caching } from 'cache-manager'
import redisStore from 'cache-manager-ioredis'
import { ConfigType } from '@nestjs/config'
import { createRedisCluster } from '../../../../cache/src'
import { createEnhancedFetch } from '../../../middlewares/src'

export const ConsultationPortalApiProvider = {
  provide: CasesApi,
  useFactory: (config: ConfigType<typeof ConsultationPortalClientConfig>) => {
    const cache =
      config.redis.nodes.length === 0
        ? undefined
        : {
            cacheManager: caching({
              store: redisStore,
              ttl: 0,
              redisInstance: createRedisCluster({
                name: 'consultation-portal',
                nodes: config.redis.nodes,
                ssl: config.redis.ssl,
                noPrefix: true,
              }),
            }),
            shared: false,
            overrideCacheControl: config.cacheControl,
          }

    return new CasesApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'consultation-portal',
          cache,
        }),
        basePath: config.basePath,
      }),
    )
  },
  inject: [ConsultationPortalClientConfig.KEY],
}
