import { Module, DynamicModule } from '@nestjs/common'

import { MainResolver } from './graphql'
import { MortgageCertificateService } from './mortgageCertificate.service'
// import {
//   MortgageCertificateApiModule,
//   MortgageCertificateApiConfig,
// } from '@island.is/clients/mortgage-certificate'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

// export interface Config {
//   clientConfig: MortgageCertificateApiConfig
// }

@Module({})
export class MortgageCertificateModule {
  // static register(config: Config): DynamicModule {
  static register(): DynamicModule {
    return {
      module: MortgageCertificateModule,
      providers: [MainResolver, MortgageCertificateService],
      // imports: [MortgageCertificateApiModule.register(config.clientConfig)],
      imports: [SyslumennClientModule],
      exports: [MortgageCertificateService],
    }
  }
}
