import { Module } from '@nestjs/common'
import { NationalRegistryV3ApplicationsClientService } from './nationalRegistryV3Applications.service'
import { ApiConfig } from './apiConfig'
import { exportedApis } from './providers'

@Module({
  providers: [
    NationalRegistryV3ApplicationsClientService,
    ApiConfig,
    ...exportedApis,
  ],
  exports: [NationalRegistryV3ApplicationsClientService],
})
export class NationalRegistryV3ApplicationsClientModule {}
