//TODOx cleanup

// import { Module, DynamicModule } from '@nestjs/common'

// import { MainResolver } from './graphql'
// import { NoDebtCertificateService } from './noDebtCertificate.service'
// import {
//   NoDebtCertificateApiModule,
//   NoDebtCertificateApiConfig,
// } from '@island.is/clients/no-debt-certificate'

// export interface Config {
//   clientConfig: NoDebtCertificateApiConfig
// }

// @Module({})
// export class NoDebtCertificateModule {
//   static register(config: Config): DynamicModule {
//     return {
//       module: NoDebtCertificateModule,
//       providers: [MainResolver, NoDebtCertificateService],
//       imports: [NoDebtCertificateApiModule.register(config.clientConfig)],
//       exports: [NoDebtCertificateService],
//     }
//   }
// }

import { Module } from '@nestjs/common'
import { MainResolver } from './graphql'
import { NoDebtCertificateService } from './noDebtCertificate.service'
// import { SyslumennClientModule } from '@island.is/clients/syslumenn'

@Module({
  providers: [MainResolver, NoDebtCertificateService],
  // imports: [SyslumennClientModule],
  exports: [NoDebtCertificateService],
})
export class NoDebtCertificateModule {}
