import { Module } from '@nestjs/common'
import { DisabilityLicenseApiProvider } from './disabilityLicenseClient.provider'
import { DisablitityLicenseService } from './disabilityLicenseClient.service'

@Module({
  providers: [DisabilityLicenseApiProvider, DisablitityLicenseService],
  exports: [DisabilityLicenseApiProvider, DisablitityLicenseService],
})
export class DisabilityLicenseClientModule {}
