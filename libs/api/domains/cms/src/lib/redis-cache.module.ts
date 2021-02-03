import { CacheModule, Module } from '@nestjs/common'
import { RedisCacheService } from './redis-cache.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        store: redisStore,
        host: 'localhost',
        port: '6379',
        ttl: 30000,
        max: 10000,
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
