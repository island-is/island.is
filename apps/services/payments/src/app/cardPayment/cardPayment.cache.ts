import { DynamicModule } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { createRedisCacheStores } from '@island.is/cache'
import { ConfigType } from '@nestjs/config'
import { CardPaymentModuleConfig } from './cardPayment.config'

let CardPaymentCacheModule: DynamicModule

export const CACHE_MODULE_KEY = 'CardPaymentModuleCache'

if (process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true') {
  CardPaymentCacheModule = NestCacheModule.register()
} else {
  CardPaymentCacheModule = NestCacheModule.registerAsync({
    useFactory: (config: ConfigType<typeof CardPaymentModuleConfig>) => {
      return {
        stores: createRedisCacheStores(
          {
            name: 'cardPayment',
            ssl: config.redis.ssl,
            nodes: config.redis.nodes,
          },
          { legacyKeyFallback: true },
        ),
      }
    },
    inject: [CardPaymentModuleConfig.KEY],
  })
}

export { CardPaymentCacheModule }
