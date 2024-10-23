import { Module } from '@nestjs/common'
import { ChildrenResidenceChangeService } from './children-residence-change.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { SharedTemplateAPIModule } from '../../shared'
import { SmsModule } from '@island.is/nova-sms'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    SmsModule,
    NationalRegistryClientModule,
    AwsModule,
  ],
  providers: [ChildrenResidenceChangeService],
  exports: [ChildrenResidenceChangeService],
})
export class ChildrenResidenceChangeModule {}
