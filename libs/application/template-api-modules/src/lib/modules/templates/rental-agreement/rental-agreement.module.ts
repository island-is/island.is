import { Module } from '@nestjs/common'

import { HmsRentalAgreementClientModule } from '@island.is/clients/hms-rental-agreement'

import { RentalAgreementService } from './rental-agreement.service'

@Module({
  imports: [HmsRentalAgreementClientModule],
  providers: [RentalAgreementService],
  exports: [RentalAgreementService],
})
export class RentalAgreementModule {}
