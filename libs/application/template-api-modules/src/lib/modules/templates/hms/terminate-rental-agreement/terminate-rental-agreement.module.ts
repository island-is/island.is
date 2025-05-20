import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { TerminateRentalAgreementService } from './terminate-rental-agreement.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [TerminateRentalAgreementService],
  exports: [TerminateRentalAgreementService],
})
export class TerminateRentalAgreementModule {}
