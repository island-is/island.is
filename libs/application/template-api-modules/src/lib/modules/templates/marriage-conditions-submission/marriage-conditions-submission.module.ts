import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { MarriageConditionsSubmissionService } from './marriage-conditions-submission.service'
import { SharedTemplateAPIModule } from '../../shared'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { NationalRegistryV3Module } from '../../shared/api/national-registry-v3/national-registry-v3.module'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    NationalRegistryV3Module,
    NationalRegistryXRoadModule,
  ],
  providers: [MarriageConditionsSubmissionService],
  exports: [MarriageConditionsSubmissionService],
})
export class MarriageConditionsSubmissionModule {}
