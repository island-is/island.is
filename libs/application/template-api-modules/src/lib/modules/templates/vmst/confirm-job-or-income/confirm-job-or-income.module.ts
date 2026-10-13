import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../../shared'

import { ConfirmJobOrIncomeService } from './confirm-job-or-income.service'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VmstUnemploymentClientModule,
  ],
  providers: [ConfirmJobOrIncomeService],
  exports: [ConfirmJobOrIncomeService],
})
export class ConfirmJobOrIncomeModule {}
