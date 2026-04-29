import { Module } from '@nestjs/common'
import { HmsModule } from '@island.is/clients/hms'

import { RentalAgreementSdfService } from './rental-agreement-sdf.service'

@Module({
  imports: [HmsModule],
  providers: [RentalAgreementSdfService],
  exports: [RentalAgreementSdfService],
})
export class RentalAgreementSdfModule {}
