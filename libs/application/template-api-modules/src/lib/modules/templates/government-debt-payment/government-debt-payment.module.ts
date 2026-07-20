import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { GovernmentDebtPaymentService } from './government-debt-payment.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { FinanceClientV3Module } from '@island.is/clients/finance-v3'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    FinanceClientV3Module,
  ],
  providers: [GovernmentDebtPaymentService],
  exports: [GovernmentDebtPaymentService],
})
export class GovernmentDebtPaymentModule {}
