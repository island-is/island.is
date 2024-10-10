import { Module } from '@nestjs/common'
import { ChildrenResidenceChangeService } from './children-residence-change.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SharedTemplateAPIModule } from '../../shared'
import { SmsModule } from '@island.is/nova-sms'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    SmsModule,
    NationalRegistryClientModule,
  ],
  providers: [ChildrenResidenceChangeService],
  exports: [ChildrenResidenceChangeService],
})
export class ChildrenResidenceChangeModule {}
