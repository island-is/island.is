import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { MarriageConditionsSubmissionService } from './marriage-conditions-submission.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

export class MarriageConditionsSubmissionModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: MarriageConditionsSubmissionModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [MarriageConditionsSubmissionService],
      exports: [MarriageConditionsSubmissionService],
    }
  }
}
