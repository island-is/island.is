import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'
import { NationalRegistryV3Module } from '../../../shared/api/national-registry-v3/national-registry-v3.module'

import { HousingBenefitsService } from './housing-benefits.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { HmsRentalAgreementClientModule } from '@island.is/clients/hms-rental-agreement'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    HmsRentalAgreementClientModule,
    NationalRegistryV3Module,
  ],
  providers: [HousingBenefitsService],
  exports: [HousingBenefitsService],
})
export class HousingBenefitsModule {}
