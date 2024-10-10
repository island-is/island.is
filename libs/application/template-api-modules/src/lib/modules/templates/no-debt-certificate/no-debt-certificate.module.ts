import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { NoDebtCertificateService } from './no-debt-certificate.service'
import { FinanceClientModule } from '@island.is/clients/finance'
import { ConfigModule } from '@nestjs/config'
import { FinanceClientConfig } from '@island.is/clients/finance'

@Module({
  imports: [
    SharedTemplateAPIModule,
    FinanceClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FinanceClientConfig],
    }),
  ],
  providers: [NoDebtCertificateService],
  exports: [NoDebtCertificateService],
})
export class NoDebtCertificateModule {}
