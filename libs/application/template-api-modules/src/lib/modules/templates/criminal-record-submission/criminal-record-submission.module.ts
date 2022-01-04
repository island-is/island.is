import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { CriminalRecordSubmissionService } from './criminal-record-submission.service'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

export class CriminalRecordSubmissionModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CriminalRecordSubmissionModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        CriminalRecordModule.register(baseConfig.criminalRecord),
        SyslumennClientModule,
      ],
      providers: [CriminalRecordSubmissionService],
      exports: [CriminalRecordSubmissionService],
    }
  }
}
