import { DynamicModule } from '@nestjs/common'

import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'

import { PSignSubmissionService } from './p-sign-submission.service'

export class PSignSubmissionModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PSignSubmissionModule,
      imports: [
        SyslumennClientModule,
        SharedTemplateAPIModule.register(config),
      ],
      providers: [PSignSubmissionService],
      exports: [PSignSubmissionService],
    }
  }
}
