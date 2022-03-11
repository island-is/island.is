import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { MortgageCertificateSubmissionService } from './mortgage-certificate-submission.service'
import { MortgageCertificateModule } from '@island.is/api/domains/mortgage-certificate'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

export class MortgageCertificateSubmissionModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: MortgageCertificateSubmissionModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        MortgageCertificateModule,
        SyslumennClientModule,
      ],
      providers: [MortgageCertificateSubmissionService],
      exports: [MortgageCertificateSubmissionService],
    }
  }
}
