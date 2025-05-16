import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { ActivationAllowanceService } from './activation-allowance.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
@Module({
  imports: [SharedTemplateAPIModule, ApplicationsNotificationsModule],
  providers: [ActivationAllowanceService],
  exports: [ActivationAllowanceService],
})
export class ActivationAllowanceModule {}
