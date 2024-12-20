import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { MortgageCertificateSubmissionService } from './mortgage-certificate-submission.service'
import { MortgageCertificateModule } from '@island.is/api/domains/mortgage-certificate'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({
  imports: [
    SharedTemplateAPIModule,
    MortgageCertificateModule,
    SyslumennClientModule,
  ],
  providers: [MortgageCertificateSubmissionService],
  exports: [MortgageCertificateSubmissionService],
})
export class MortgageCertificateSubmissionModule {}
