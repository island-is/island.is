import { Module } from '@nestjs/common'

import { ConfirmJobSearchService } from './confirm-job-search.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
@Module({
  imports: [ApplicationsNotificationsModule, VmstUnemploymentClientModule],
  providers: [ConfirmJobSearchService],
  exports: [ConfirmJobSearchService],
})
export class ConfirmJobSearchModule {}
