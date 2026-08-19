import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { PayDebtsService } from './pay-debts.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [PayDebtsService],
  exports: [PayDebtsService],
})
export class PayDebtsModule {}
