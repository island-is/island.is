import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { HousingBenefitsService } from './housing-benefits.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { HmsRentalAgreementClientModule } from '@island.is/clients/hms-rental-agreement'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    HmsRentalAgreementClientModule,
  ],
  providers: [HousingBenefitsService],
  exports: [HousingBenefitsService],
})
export class HousingBenefitsModule {}
