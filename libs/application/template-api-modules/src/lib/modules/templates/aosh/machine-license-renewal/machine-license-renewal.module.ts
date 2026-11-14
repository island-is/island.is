import { Module } from '@nestjs/common'
import { MachineLicenseRenewalService } from './machine-license-renewal.service'

@Module({
  providers: [MachineLicenseRenewalService],
  exports: [MachineLicenseRenewalService],
})
export class MachineLicenseRenewalModule {}
