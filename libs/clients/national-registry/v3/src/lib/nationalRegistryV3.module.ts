import { Module } from '@nestjs/common'
import { NationalRegistryV3ClientService } from './nationalRegistryV3.service'
import { ApiConfig } from './apiConfig'
import { exportedApis } from './providers'
import { IdsClientConfig } from '@island.is/nest/config'

@Module({
  //imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfig, NationalRegistryV3ClientService, ...exportedApis],
  exports: [NationalRegistryV3ClientService],
})
export class NationalRegistryV3ClientModule {}
