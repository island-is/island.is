import { Module } from '@nestjs/common'
import { NationalRegistryV3ClientService } from './nationalRegistryV3.service'
import { ApiConfig } from './apiConfig'
import { exportedApis } from './providers'

@Module({
  providers: [NationalRegistryV3ClientService, ApiConfig, ...exportedApis],
  exports: [NationalRegistryV3ClientService],
})
export class NationalRegistryV3ClientModule {}
