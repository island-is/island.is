import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { TerminateRentalAgreementService } from './terminate-rental-agreement.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { HmsHousingBenefitsClientModule } from '@island.is/clients/hms-housing-benefits'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    HmsHousingBenefitsClientModule,
  ],
  providers: [TerminateRentalAgreementService],
  exports: [TerminateRentalAgreementService],
})
export class TerminateRentalAgreementModule {}
