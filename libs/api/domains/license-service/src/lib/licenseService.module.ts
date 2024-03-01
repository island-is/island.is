import { LicenseClientModule } from '@island.is/clients/license-client'
import { CmsModule } from '@island.is/cms'
import { Module } from '@nestjs/common'

import { LicenseServiceResolver } from './licenseService.resolver'
import { LicenseServiceService } from './licenseService.service'
import { LicenseMapperModule } from './modules/licenseMapper.module'

import {
  CacheProvider,
  LicenseMapperProvider,
  LoggerProvider,
  TokenServiceProvider,
} from './providers'

@Module({
  imports: [LicenseClientModule, LicenseMapperModule, CmsModule],
  providers: [
    LicenseServiceResolver,
    LicenseServiceService,
    TokenServiceProvider,
    LoggerProvider,
    CacheProvider,
    LicenseMapperProvider,
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
