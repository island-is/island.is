import { DynamicModule, Module, Global } from '@nestjs/common'
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager'
import { redisInsStore } from 'cache-manager-ioredis-yet'
import { createRedisCluster } from '@island.is/cache'
import { ConfigType } from '@nestjs/config'
import { BffConfig } from '../../bff.config'
import { CacheService } from './cache.service'

@Global()
@Module({})
export class CacheModule {
  static register(): DynamicModule {
    const imports =
      process.env.NODE_ENV === 'test' || process.env.INIT_SCHEMA === 'true'
        ? [NestCacheModule.register()]
        : [
            NestCacheModule.registerAsync({
              useFactory: ({
                redis: { ssl, nodes },
              }: ConfigType<typeof BffConfig>) => ({
                store: redisInsStore(
                  createRedisCluster({
                    name: 'bff',
                    ssl,
                    nodes,
                  }),
                ),
              }),
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
