import { DynamicModule } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { redisInsStore } from 'cache-manager-ioredis-yet'
import { createRedisCluster } from '@island.is/cache'
import { ConfigType } from '@nestjs/config'
import { BffConfig } from '../../bff.config'

let CacheModule: DynamicModule

export const CACHE_MODULE_KEY = 'BFFModuleCache'

if (process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true') {
  CacheModule = NestCacheModule.register()
} else {
  CacheModule = NestCacheModule.registerAsync({
    useFactory: ({ redis: { ssl, nodes } }: ConfigType<typeof BffConfig>) => ({
      store: redisInsStore(
        createRedisCluster({
          name: 'bff',
          ssl,
          nodes,
        }),
      ),
    }),
    inject: [BffConfig.KEY],
  })
}

export { CacheModule }
