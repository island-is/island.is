import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { FireCompensationAppraisalService } from './fire-compensation-appraisal.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { AssetsClientModule } from '@island.is/clients/assets'
import { HmsApplicationSystemModule } from '@island.is/clients/hms-application-system'
import { HmsModule } from '@island.is/clients/hms'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    AssetsClientModule,
    HmsApplicationSystemModule,
    HmsModule,
  ],
  providers: [FireCompensationAppraisalService],
  exports: [FireCompensationAppraisalService],
})
export class FireCompensationAppraisalModule {}
