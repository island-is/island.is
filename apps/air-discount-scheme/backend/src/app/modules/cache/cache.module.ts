import { DynamicModule } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { redisInsStore } from 'cache-manager-ioredis-yet'
import { createRedisCluster } from '@island.is/cache'
import { environment } from '../../../environments'

const { redis, production } = environment
let CacheModule: DynamicModule

if (process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true') {
  CacheModule = NestCacheModule.register()
} else {
  CacheModule = NestCacheModule.register({
    store: redisInsStore(
      createRedisCluster({
        name: 'air_discount_scheme_backend_service_cache',
        ssl: production,
        nodes: redis.urls,
      }),
    ),
  })
}

export { CacheModule }
