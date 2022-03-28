import { Module } from '@nestjs/common'

import { IdsClientConfig } from '@island.is/nest/config'

import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  imports: [IdsClientConfig.registerOptional()],
  providers: [ApiConfiguration, ...exportedApis],
  exports: exportedApis,
})
export class NationalRegistryClientModule {}
