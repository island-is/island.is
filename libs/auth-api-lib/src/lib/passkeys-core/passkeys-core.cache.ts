import { DynamicModule } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { createRedisCacheStores } from '@island.is/cache'
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
        stores: createRedisCacheStores(
          {
            name: 'passkeys-core',
            ssl: config.redis.ssl,
            nodes: config.redis.nodes,
          },
          { legacyKeyFallback: true },
        ),
      }
    },
    inject: [PasskeysCoreConfig.KEY],
  })
}

export { CacheModule }
