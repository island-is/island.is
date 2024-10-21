import { Module } from '@nestjs/common'
import { VMSTModule } from '@island.is/clients/vmst'
import { SharedTemplateAPIModule } from '../../shared'
import { ParentalLeaveService } from './parental-leave.service'
import { SmsModule } from '@island.is/nova-sms'
import { ChildrenService } from './children/children.service'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import {
  NationalRegistryClientModule,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    VMSTModule,
    SharedTemplateAPIModule,
    SmsModule,
    ApplicationApiCoreModule,
    NationalRegistryClientModule,
    AwsModule,
  ],
  providers: [
    ChildrenService,
    ParentalLeaveService,
    NationalRegistryClientService,
  ],
  exports: [ParentalLeaveService],
})
export class ParentalLeaveModule {}
