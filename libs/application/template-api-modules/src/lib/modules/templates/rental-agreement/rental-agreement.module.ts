import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'

import { RentalAgreementService } from './rental-agreement.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [RentalAgreementService],
  exports: [RentalAgreementService],
})
export class RentalAgreementModule {}
