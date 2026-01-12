import { Module } from '@nestjs/common'
import { NationalRegistryV3ApplicationsClientService } from './nationalRegistryV3Applications.service'
import {
  ApiConfigWithB2CAuth,
  ApiConfigWithIdsAuth,
  exportedApis,
} from './apiConfig'

@Module({
  providers: [
    NationalRegistryV3ApplicationsClientService,
    ApiConfigWithIdsAuth,
    ApiConfigWithB2CAuth,
    ...exportedApis,
  ],
  exports: [NationalRegistryV3ApplicationsClientService],
})
export class NationalRegistryV3ApplicationsClientModule {}
