import { Module } from '@nestjs/common'
import { DisabilityLicenseApiProvider } from './disabilityLicenseClient.provider'

@Module({
  providers: [DisabilityLicenseApiProvider],
  exports: [DisabilityLicenseApiProvider],
})
export class DisabilityLicenseClientModule {}
