import { Module, DynamicModule } from '@nestjs/common'
import { MainResolver } from './graphql'
import { MortgageCertificateService } from './mortgageCertificate.service'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({})
export class MortgageCertificateModule {
  static register(): DynamicModule {
    return {
      module: MortgageCertificateModule,
      providers: [MainResolver, MortgageCertificateService],
      imports: [SyslumennClientModule],
      exports: [MortgageCertificateService],
    }
  }
}
