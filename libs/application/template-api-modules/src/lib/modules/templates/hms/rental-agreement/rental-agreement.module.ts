import { Module } from '@nestjs/common'

import { HmsRentalAgreementClientModule } from '@island.is/clients/hms-rental-agreement'

import { RentalAgreementService } from './rental-agreement.service'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'

@Module({
  imports: [HmsRentalAgreementClientModule, CompanyRegistryClientModule],
  providers: [RentalAgreementService],
  exports: [RentalAgreementService],
})
export class RentalAgreementModule {}
