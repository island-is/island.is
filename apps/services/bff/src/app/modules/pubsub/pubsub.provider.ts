import { Provider } from '@nestjs/common'

import { createRedisCluster } from '@island.is/cache'
import { ConfigType } from '@nestjs/config'
import { Cluster } from 'ioredis'
import { BffConfig } from '../../bff.config'

export const REDIS_PUB_SUB = 'REDIS_PUB_SUB'

export const PubsubProvider: Provider<Cluster> = {
  provide: REDIS_PUB_SUB,
  useFactory: ({ redis }: ConfigType<typeof BffConfig>) => {
    return createRedisCluster(redis)
  },
  inject: [BffConfig.KEY],
}
