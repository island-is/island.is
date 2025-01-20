import { Module } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { MarriageConditionsSubmissionService } from './marriage-conditions-submission.service'
import { SharedTemplateAPIModule } from '../../shared'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

@Module({
  imports: [
    SyslumennClientModule,
    SharedTemplateAPIModule,
    NationalRegistryXRoadModule,
    ChargeFjsV2ClientModule,
  ],
  providers: [MarriageConditionsSubmissionService],
  exports: [MarriageConditionsSubmissionService],
})
export class MarriageConditionsSubmissionModule {}
