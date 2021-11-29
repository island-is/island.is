import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { PMarkSubmissionService } from './p-mark-submission.service'
import { PMarkModule } from '@island.is/api/domains/p-mark'

export class PMarkSubmissionModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PMarkSubmissionModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        PMarkModule.register(baseConfig.drivingLicense),
      ],
      providers: [PMarkSubmissionService],
      exports: [PMarkSubmissionService],
    }
  }
}
