import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { EuropeanHealthInsuranceCardService } from './european-health-insurance-card.service'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'

@Module({
  imports: [SharedTemplateAPIModule, RightsPortalClientModule],
  providers: [EuropeanHealthInsuranceCardService],
  exports: [EuropeanHealthInsuranceCardService],
})
export class EuropeanHealthInsuranceCardModule {}
