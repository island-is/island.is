import { Module } from '@nestjs/common'
import { VMSTModule } from '@island.is/clients/vmst'
import { SharedTemplateAPIModule } from '../../shared'
import { ParentalLeaveService } from './parental-leave.service'
import { SmsModule } from '@island.is/nova-sms'
import { ChildrenService } from './children/children.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { AwsModule } from '@island.is/nest/aws'
import { NationalRegistryV3Module } from '../../shared/api/national-registry-v3/national-registry-v3.module'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'

@Module({
  imports: [
    VMSTModule,
    SharedTemplateAPIModule,
    SmsModule,
    ApplicationApiCoreModule,
    NationalRegistryV3Module,
    AwsModule,
    ApplicationsNotificationsModule,
  ],
  providers: [ChildrenService, ParentalLeaveService],
  exports: [ParentalLeaveService],
})
export class ParentalLeaveModule {}
