import { Module } from '@nestjs/common'
import { ApiConfig } from './api.config'
import { AdrLicenseServiceProvider } from './providers/adrLicenseServiceProvider'
import { MachineLicenseServiceProvider } from './providers/machineLicenseProvider'
@Module({
  providers: [
    ApiConfig,
    MachineLicenseServiceProvider,
    AdrLicenseServiceProvider,
  ],
  exports: [MachineLicenseServiceProvider, AdrLicenseServiceProvider],
})
export class AdrAndMachineLicenseClientModule {}
