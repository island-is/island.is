import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { CriminalRecordSubmissionService } from './criminal-record-submission.service'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { SyslumennModule } from '@island.is/api/domains/syslumenn'

export class CriminalRecordSubmissionModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CriminalRecordSubmissionModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        CriminalRecordModule.register(baseConfig.criminalRecord),
        SyslumennModule.register(baseConfig.syslumenn),
      ],
      providers: [CriminalRecordSubmissionService],
      exports: [CriminalRecordSubmissionService],
    }
  }
}