import { createRedisCluster } from '@island.is/cache'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { DynamicModule, Global, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { redisInsStore } from 'cache-manager-ioredis-yet'
import { BffConfig } from '../../bff.config'
import { CacheService } from './cache.service'

@Global()
@Module({})
export class CacheModule {
  static register(): DynamicModule {
    const imports =
      process.env.NODE_ENV === 'test'
        ? [NestCacheModule.register()]
        : [
            NestCacheModule.registerAsync({
              useFactory: ({ redis }: ConfigType<typeof BffConfig>) => {
                const configHasRedis = redis.nodes.length > 0 && redis.name

                return {
                  store: configHasRedis
                    ? redisInsStore(createRedisCluster(redis) as any)
                    : undefined,
                }
              },
              inject: [BffConfig.KEY],
            }),
          ]

    return {
      module: CacheModule,
      imports,
      providers: [CacheService],
      exports: [CacheService],
    }
  }
}
