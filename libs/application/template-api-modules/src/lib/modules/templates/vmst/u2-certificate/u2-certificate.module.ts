import { Module } from '@nestjs/common'

import { U2CertificateService } from './u2-certificate.service'
import { VmstUnemploymentClientModule } from '@island.is/clients/vmst-unemployment'
@Module({
  imports: [VmstUnemploymentClientModule],
  providers: [U2CertificateService],
  exports: [U2CertificateService],
})
export class U2CertificateModule {}
