import { LicenseClientModule } from '@island.is/clients/license-client'
import { LicenseModule } from '@island.is/services/license'
import { Module } from '@nestjs/common'

import { LicenseServiceService } from './licenseService.service'
import { LicenseMapperModule } from './mappers/licenseMapper.module'

import { LicenseMapperProvider, LoggerProvider } from './providers'
import { LicenseCollectionResolver } from './resolvers/licenseCollection.resolver'
import { PkPassResolver } from './resolvers/pkPass.resolver'
import { UserLicenseResolver } from './resolvers/userLicense.resolver'
import { LicenseProviderResolver } from './resolvers/provider.resolver'

@Module({
  imports: [LicenseClientModule, LicenseMapperModule, LicenseModule],
  providers: [
    LicenseCollectionResolver,
    PkPassResolver,
    UserLicenseResolver,
    LicenseProviderResolver,
    LicenseServiceService,
    LoggerProvider,
    LicenseMapperProvider,
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
