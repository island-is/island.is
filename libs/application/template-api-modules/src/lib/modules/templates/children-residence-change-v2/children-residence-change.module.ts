import { Module } from '@nestjs/common'
import { ChildrenResidenceChangeServiceV2 } from './children-residence-change.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SharedTemplateAPIModule } from '../../shared'
import { SmsModule } from '@island.is/nova-sms'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    SmsModule,
    NationalRegistryClientModule,
    ApplicationsNotificationsModule,
  ],
  providers: [ChildrenResidenceChangeServiceV2],
  exports: [ChildrenResidenceChangeServiceV2],
})
export class ChildrenResidenceChangeModuleV2 {}
