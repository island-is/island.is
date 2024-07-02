import { LicenseClientModule } from '@island.is/clients/license-client'
import { LicenseModule } from '@island.is/services/license'
import { Module } from '@nestjs/common'
import { LicenseMapperModule } from './mappers/licenseMapper.module'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { LicenseCollectionResolver } from './resolvers/licenseCollection.resolver'
import { PkPassResolver } from './resolvers/pkPass.resolver'
import { UserLicenseResolver } from './resolvers/userLicense.resolver'
import { LicenseProviderResolver } from './resolvers/provider.resolver'
import { LicenseMapperProvider, LoggerProvider } from './providers'
import { LicenseService } from './licenseService.service'

@Module({
  imports: [
    LicenseClientModule,
    LicenseMapperModule,
    LicenseModule,
    FeatureFlagModule,
  ],
  providers: [
    LicenseService,
    LoggerProvider,
    LicenseMapperProvider,
    LicenseCollectionResolver,
    PkPassResolver,
    UserLicenseResolver,
    LicenseProviderResolver,
  ],
  exports: [LicenseService],
})
export class LicenseServiceModule {}
