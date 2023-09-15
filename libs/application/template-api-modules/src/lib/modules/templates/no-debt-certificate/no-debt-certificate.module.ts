import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { NoDebtCertificateService } from './no-debt-certificate.service'
import { FinanceClientModule } from '@island.is/clients/finance'
import { ConfigModule } from '@nestjs/config'
import { FinanceClientConfig } from '@island.is/clients/finance'

export class NoDebtCertificateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NoDebtCertificateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        FinanceClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [FinanceClientConfig],
        }),
      ],
      providers: [NoDebtCertificateService],
      exports: [NoDebtCertificateService],
    }
  }
}
