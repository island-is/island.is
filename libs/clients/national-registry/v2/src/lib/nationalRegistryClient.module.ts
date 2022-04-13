import { Module } from '@nestjs/common'

import { IdsClientConfig } from '@island.is/nest/config'

import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { NationalRegistryClientService } from './nationalRegistryClient.service'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfiguration, NationalRegistryClientService, ...exportedApis],
  exports: [NationalRegistryClientService, ...exportedApis],
})
export class NationalRegistryClientModule {}
