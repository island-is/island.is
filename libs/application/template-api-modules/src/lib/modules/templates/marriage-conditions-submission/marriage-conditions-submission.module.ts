import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { MarriageConditionsSubmissionService } from './marriage-conditions-submission.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'

export class MarriageConditionsSubmissionModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: MarriageConditionsSubmissionModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
        NationalRegistryXRoadModule,
      ],
      providers: [MarriageConditionsSubmissionService],
      exports: [MarriageConditionsSubmissionService],
    }
  }
}
