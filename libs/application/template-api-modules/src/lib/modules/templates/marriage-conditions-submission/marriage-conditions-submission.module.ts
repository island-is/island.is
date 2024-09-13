import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { MarriageConditionsSubmissionService } from './marriage-conditions-submission.service'
import { SharedTemplateAPIModule } from '../../shared'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    NationalRegistryXRoadModule,
  ],
  providers: [MarriageConditionsSubmissionService],
  exports: [MarriageConditionsSubmissionService],
})
export class MarriageConditionsSubmissionModule {}
