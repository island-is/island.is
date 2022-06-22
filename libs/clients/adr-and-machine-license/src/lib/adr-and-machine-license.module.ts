import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import { exportedApis } from './providers'

@Module({
  providers: [ApiConfig, ...exportedApis],
  exports: exportedApis,
})
export class AdrAndMachineLicenseClientModule {}
