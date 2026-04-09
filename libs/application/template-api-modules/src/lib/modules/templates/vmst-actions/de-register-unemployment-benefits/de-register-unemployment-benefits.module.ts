import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { DeRegisterUnemploymentBenefitsService } from './de-register-unemployment-benefits.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [DeRegisterUnemploymentBenefitsService],
  exports: [DeRegisterUnemploymentBenefitsService],
})
export class DeRegisterUnemploymentBenefitsModule {}
