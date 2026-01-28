import { DynamicModule } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { redisInsStore } from 'cache-manager-ioredis-yet'
import { createRedisCluster } from '@island.is/cache'
import { ConfigType } from '@nestjs/config'
import { CmsTranslationConfig } from './cms-translations.config'

let CmsTranslationCacheModule: DynamicModule

export const CACHE_MODULE_KEY = 'CmsTranslationModuleCache'

if (process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true') {
  CmsTranslationCacheModule = NestCacheModule.register()
} else {
  CmsTranslationCacheModule = NestCacheModule.registerAsync({
    useFactory: (config: ConfigType<typeof CmsTranslationConfig>) => {
      return {
        store: redisInsStore(
          createRedisCluster({
            name: 'cmsTranslation',
            ssl: config.redis.ssl,
            nodes: config.redis.nodes,
          }),
        ),
      }
    },
    inject: [CmsTranslationConfig.KEY],
  })
}

export { CmsTranslationCacheModule }
