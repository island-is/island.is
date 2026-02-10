import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { TokenMiddleware } from './client-althingi-ombudsman.middleware'
import { AlthingiOmbudsmanClientConfig } from './clients-althingi-ombudsman.config'
import { ConfigType } from '@nestjs/config'
import { SecurityApi } from '../gen/fetch/dev'

@Module({
  exports: [...exportedApis, TokenMiddleware],
  providers: [
    ApiConfiguration,
    {
      provide: TokenMiddleware,
      useFactory: (
        config: ConfigType<typeof AlthingiOmbudsmanClientConfig>,
        securityApi,
      ) => new TokenMiddleware(config, securityApi),
      inject: [AlthingiOmbudsmanClientConfig.KEY, SecurityApi],
    },
    ...exportedApis,
  ],
})
export class ClientsAlthingiOmbudsmanModule {}
