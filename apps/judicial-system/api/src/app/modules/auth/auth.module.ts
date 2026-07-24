import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'

import { createRedisKeyv } from '@island.is/cache'
import { type ConfigType } from '@island.is/nest/config'

import { BackendModule } from '../backend/backend.module'
import { authModuleConfig } from './auth.config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TokenStorageService } from './tokenStorage.service'

@Module({
  imports: [
    BackendModule,
    NestCacheModule.registerAsync({
      isGlobal: false,
      inject: [authModuleConfig.KEY],
      useFactory: (config: ConfigType<typeof authModuleConfig>) => {
        const { redis } = config
        const hasRedis = redis.nodes.length > 0 && redis.name

        return {
          stores: hasRedis ? [createRedisKeyv(redis)] : undefined,
        }
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenStorageService],
})
export class AuthModule {}
