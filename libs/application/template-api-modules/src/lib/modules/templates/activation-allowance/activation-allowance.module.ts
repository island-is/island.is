import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { ActivationAllowanceService } from './activation-allowance.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { WorkMachinesClientModule } from '@island.is/clients/work-machines'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    WorkMachinesClientModule,
    DrivingLicenseApiModule,
    VmstUnemploymentClientModule,
  ],
  providers: [ActivationAllowanceService],
  exports: [ActivationAllowanceService],
})
export class ActivationAllowanceModule {}
