import { Module } from '@nestjs/common'
import { SeminarsClientModule } from '@island.is/clients/seminars-ver'
import { SharedTemplateAPIModule } from '../../../shared'
import { MachineLicenseRenewalService } from './machine-license-renewal.service'

@Module({
  imports: [SharedTemplateAPIModule, SeminarsClientModule],
  providers: [MachineLicenseRenewalService],
  exports: [MachineLicenseRenewalService],
})
export class MachineLicenseRenewalModule {}
