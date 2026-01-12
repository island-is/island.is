import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { FireCompensationAppraisalService } from './fire-compensation-appraisal.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { AssetsClientModule } from '@island.is/clients/assets'
import { HmsApplicationSystemModule } from '@island.is/clients/hms-application-system'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    AssetsClientModule,
    HmsApplicationSystemModule,
  ],
  providers: [FireCompensationAppraisalService],
  exports: [FireCompensationAppraisalService],
})
export class FireCompensationAppraisalModule {}
