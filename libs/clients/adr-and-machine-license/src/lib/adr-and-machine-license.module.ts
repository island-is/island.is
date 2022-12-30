import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import {
  AdrLicenseServiceProvider,
  MachineLicenseServiceProvider,
} from './providers'
@Module({
  providers: [
    ApiConfig,
    MachineLicenseServiceProvider,
    AdrLicenseServiceProvider,
  ],
  exports: [MachineLicenseServiceProvider, AdrLicenseServiceProvider],
})
export class AdrAndMachineLicenseClientModule {}
