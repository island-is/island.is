import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { ConfirmJobSearchService } from './confirm-job-search.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [ConfirmJobSearchService],
  exports: [ConfirmJobSearchService],
})
export class ConfirmJobSearchModule {}
