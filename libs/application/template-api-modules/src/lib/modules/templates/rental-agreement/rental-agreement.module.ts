import { Module } from '@nestjs/common'

import { HmsRentalAgreementClientModule } from '@island.is/clients/hms-rental-agreement'

import { SharedTemplateAPIModule } from '../../shared'
import { RentalAgreementService } from './rental-agreement.service'

@Module({
  imports: [HmsRentalAgreementClientModule, SharedTemplateAPIModule],
  providers: [RentalAgreementService],
  exports: [RentalAgreementService],
})
export class RentalAgreementModule {}
