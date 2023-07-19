import { Module } from '@nestjs/common'
import { NationalRegistryV3ClientService } from './nationalRegistryV3.service'
import { ApiConfig } from './apiConfig'
import { exportedApis } from './providers'
import { NationalRegistryV3ClientConfig } from './nationalRegistryV3.config'
import { ConfigType } from '@nestjs/config'

@Module({
  providers: [
    NationalRegistryV3ClientService,
    ApiConfig,
    ...exportedApis,
    {
      provide: 'nat-config',
      useFactory: (config: ConfigType<typeof NationalRegistryV3ClientConfig>) =>
        config,
      inject: [NationalRegistryV3ClientConfig.KEY],
    },
  ],
  exports: [NationalRegistryV3ClientService],
})
export class NationalRegistryV3ClientModule {}
