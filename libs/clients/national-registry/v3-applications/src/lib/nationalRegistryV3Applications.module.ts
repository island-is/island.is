import { Module } from '@nestjs/common'
import { NationalRegistryV3ApplicationsClientService } from './nationalRegistryV3Applications.service'
import {
  ApiConfigWithB2CAuth,
  ApiConfigWithIdsAuth,
  exportedApis,
} from './apiConfig'
import { IdsClientConfig } from '@island.is/nest/config'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [
    NationalRegistryV3ApplicationsClientService,
    ApiConfigWithIdsAuth,
    ApiConfigWithB2CAuth,
    ...exportedApis,
  ],
  exports: [NationalRegistryV3ApplicationsClientService],
})
export class NationalRegistryV3ApplicationsClientModule {}
