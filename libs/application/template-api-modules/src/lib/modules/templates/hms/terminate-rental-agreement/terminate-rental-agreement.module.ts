import { Module } from '@nestjs/common'
import { TerminateRentalAgreementService } from './terminate-rental-agreement.service'
import { HmsRentalAgreementClientModule } from '@island.is/clients/hms-rental-agreement'

@Module({
  imports: [HmsRentalAgreementClientModule],
  providers: [TerminateRentalAgreementService],
  exports: [TerminateRentalAgreementService],
})
export class TerminateRentalAgreementModule {}
