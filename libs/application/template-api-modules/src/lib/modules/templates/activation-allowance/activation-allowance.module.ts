import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { ActivationAllowanceService } from './activation-allowance.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
import { AwsModule } from '@island.is/nest/aws'
@Module({
  imports: [
    SharedTemplateAPIModule,
    AwsModule,
    ApplicationsNotificationsModule,
    VmstUnemploymentClientModule,
  ],
  providers: [ActivationAllowanceService],
  exports: [ActivationAllowanceService],
})
export class ActivationAllowanceModule {}
