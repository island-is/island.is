import { Module } from '@nestjs/common'
import { MainResolver } from './graphql'
import { MortgageCertificateService } from './mortgageCertificate.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({
  providers: [MainResolver, MortgageCertificateService],
  imports: [SyslumennClientModule],
  exports: [MortgageCertificateService],
})
export class MortgageCertificateModule {}
