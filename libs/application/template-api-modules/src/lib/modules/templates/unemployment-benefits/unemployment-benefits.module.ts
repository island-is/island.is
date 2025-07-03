import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { UnemploymentBenefitsService } from './unemployment-benefits.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VmstUnemploymentClientModule,
  ],
  providers: [UnemploymentBenefitsService],
  exports: [UnemploymentBenefitsService],
})
export class UnemploymentBenefitsModule {}
