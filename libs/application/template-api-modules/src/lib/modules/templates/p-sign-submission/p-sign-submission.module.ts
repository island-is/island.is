import { DynamicModule } from '@nestjs/common'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'
import { PSignSubmissionService } from './p-sign-submission.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

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
