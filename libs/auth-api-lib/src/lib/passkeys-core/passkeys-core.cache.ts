import { DynamicModule } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { redisInsStore } from 'cache-manager-ioredis-yet'
import { createRedisCluster } from '@island.is/cache'

const isProduction = false
const redis = {
  urls: [
    'localhost:7000',
    'localhost:7001',
    'localhost:7002',
    'localhost:7003',
    'localhost:7004',
    'localhost:7005',
  ],
}

let CacheModule: DynamicModule

if (process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true') {
  CacheModule = NestCacheModule.register()
} else {
  CacheModule = NestCacheModule.register({
    store: redisInsStore(
      createRedisCluster({
        name: 'passkeys-core',
        ssl: isProduction,
        nodes: redis.urls,
      }),
    ),
  })
}

export { CacheModule }
