import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { EuropeanHealthInsuranceCardService } from './european-health-insurance-card.service'
import { EhicClientModule } from '@island.is/clients/ehic-client-v1'

@Module({
  imports: [EhicClientModule, SharedTemplateAPIModule],
  providers: [EuropeanHealthInsuranceCardService],
  exports: [EuropeanHealthInsuranceCardService],
})
export class EuropeanHealthInsuranceCardModule {}
