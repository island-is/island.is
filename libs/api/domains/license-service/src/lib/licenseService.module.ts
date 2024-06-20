import { LicenseClientModule } from '@island.is/clients/license-client'
import { CmsModule } from '@island.is/cms'
import { LicenseModule } from '@island.is/services/license'
import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'

import { LicenseServiceResolver } from './licenseService.resolver'
import { LicenseServiceService } from './licenseService.service'
import { LicenseMapperModule } from './mappers/licenseMapper.module'

import { LicenseMapperProvider, LoggerProvider } from './providers'

@Module({
  imports: [
    LicenseClientModule,
    LicenseMapperModule,
    CmsModule,
    LicenseModule,
    CacheModule.register({
      ttl: 60 * 10 * 1000, // 10 minutes
    }),
  ],
  providers: [
    LicenseServiceResolver,
    LicenseServiceService,
    LoggerProvider,
    LicenseMapperProvider,
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
