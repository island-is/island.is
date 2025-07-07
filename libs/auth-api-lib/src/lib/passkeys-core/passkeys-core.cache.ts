import { DynamicModule } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { redisInsStore } from 'cache-manager-ioredis-yet'
import { createRedisCluster } from '@island.is/cache'
import { ConfigType } from '@nestjs/config'
import { PasskeysCoreConfig } from './passkeys-core.config'

let CacheModule: DynamicModule

export const CACHE_MODULE_KEY = 'PasskeysCoreModuleCache'

if (process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true') {
  CacheModule = NestCacheModule.register()
} else {
  CacheModule = NestCacheModule.registerAsync({
    useFactory: (config: ConfigType<typeof PasskeysCoreConfig>) => {
      return {
        store: redisInsStore(
          createRedisCluster({
            name: 'passkeys-core',
            ssl: config.redis.ssl,
            nodes: config.redis.nodes,
          }) as any,
        ),
      }
    },
    inject: [PasskeysCoreConfig.KEY],
  })
}

export { CacheModule }
