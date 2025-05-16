import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { FireCompensationAppraisalService } from './fire-compensation-appraisal.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [FireCompensationAppraisalService],
  exports: [FireCompensationAppraisalService],
})
export class FireCompensationAppraisalModule {}
