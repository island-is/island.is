import { Module } from '@nestjs/common'
import { EmploymentCertificateClientModule } from '@island.is/clients/fjs/employment-certificate'

import { EmploymentCertificateService } from './employment-certificate.service'

@Module({
  imports: [EmploymentCertificateClientModule],
  providers: [EmploymentCertificateService],
  exports: [EmploymentCertificateService],
})
export class EmploymentCertificateModule {}
