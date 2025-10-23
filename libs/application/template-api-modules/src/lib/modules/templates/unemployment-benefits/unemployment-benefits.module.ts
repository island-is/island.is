import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { UnemploymentBenefitsService } from './unemployment-benefits.service'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ApplicationsNotificationsModule,
    VmstUnemploymentClientModule,
    AwsModule,
  ],
  providers: [UnemploymentBenefitsService],
  exports: [UnemploymentBenefitsService],
})
export class UnemploymentBenefitsModule {}
