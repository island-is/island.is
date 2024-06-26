import { LicenseClientModule } from '@island.is/clients/license-client'
import { LicenseModule } from '@island.is/services/license'
import { Module } from '@nestjs/common'

import { LicenseServiceV2 } from './licenseService.service'
import { LicenseMapperModuleV2 } from './mappers/licenseMapper.module'
import { LicenseMapperProvider, LoggerProvider } from './providers'
import { LicenseCollectionResolver } from './resolvers/licenseCollection.resolver'
import { PkPassResolver } from './resolvers/pkPass.resolver'
import { UserLicenseResolver } from './resolvers/userLicense.resolver'
import { LicenseProviderResolver } from './resolvers/provider.resolver'

@Module({
  imports: [LicenseClientModule, LicenseMapperModuleV2, LicenseModule],
  providers: [
    LicenseCollectionResolver,
    PkPassResolver,
    UserLicenseResolver,
    LicenseProviderResolver,
    LicenseServiceV2,
    LoggerProvider,
    LicenseMapperProvider,
  ],
  exports: [LicenseServiceV2],
})
export class LicenseServiceModuleV2 {}
