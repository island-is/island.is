import { Module } from '@nestjs/common'
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { TokenMiddleware } from './client-althingi-ombudsman.middleware'
import { AlthingiOmbudsmanClientConfig } from './clients-althingi-ombudsman.config'
import { ConfigType } from '@nestjs/config'
import { SecurityApi } from '../gen/fetch/dev'

@Module({
  exports: [...exportedApis, TokenMiddleware],
  imports: [CacheModule.register()],
  providers: [
    ApiConfiguration,
    {
      provide: TokenMiddleware,
      useFactory: (
        config: ConfigType<typeof AlthingiOmbudsmanClientConfig>,
        securityApi,
        cache,
      ) =>
        new TokenMiddleware(
          config.password,
          config.username,
          securityApi,
          cache,
        ),
      inject: [AlthingiOmbudsmanClientConfig.KEY, SecurityApi, CACHE_MANAGER],
    },
    ...exportedApis,
  ],
})
export class ClientsAlthingiOmbudsmanModule {}
