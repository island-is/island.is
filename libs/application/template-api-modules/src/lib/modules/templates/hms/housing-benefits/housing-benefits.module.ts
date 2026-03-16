import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { HousingBenefitsService } from './housing-benefits.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [HousingBenefitsService],
  exports: [HousingBenefitsService],
})
export class HousingBenefitsModule {}
