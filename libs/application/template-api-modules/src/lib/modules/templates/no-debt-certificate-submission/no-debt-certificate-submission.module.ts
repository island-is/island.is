//TODOx cleanup

import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { NoDebtCertificateSubmissionService } from './no-debt-certificate-submission.service'
import { NoDebtCertificateModule } from '@island.is/api/domains/no-debt-certificate'
// import { SyslumennClientModule } from '@island.is/clients/syslumenn'

export class NoDebtCertificateSubmissionModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NoDebtCertificateSubmissionModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        NoDebtCertificateModule,
        // SyslumennClientModule,
      ],
      providers: [NoDebtCertificateSubmissionService],
      exports: [NoDebtCertificateSubmissionService],
    }
  }
}
