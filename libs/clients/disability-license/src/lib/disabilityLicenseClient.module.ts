import { Module } from '@nestjs/common'
import { DisabilityLicenseApiProvider } from './disabilityLicenseClient.provider'
import { DisabilityLicenseService } from './disabilityLicenseClient.service'

@Module({
  providers: [DisabilityLicenseApiProvider, DisabilityLicenseService],
  exports: [DisabilityLicenseService],
})
export class DisabilityLicenseClientModule {}
