import { Module } from '@nestjs/common'
import { DisabilityLicenseApiProvider } from './disabilityLicenseClient.provider'
import { DisabilityLicenseService } from './disabilityLicenseClient.service'

@Module({
  providers: [DisabilityLicenseApiProvider, DisabilityLicenseService],
  exports: [DisabilityLicenseApiProvider, DisabilityLicenseService],
})
export class DisabilityLicenseClientModule {}
