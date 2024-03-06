import { LicenseClientModule } from '@island.is/clients/license-client'
import { CmsModule } from '@island.is/cms'
import { Module } from '@nestjs/common'

import { LicenseServiceResolver } from './licenseService.resolver'
import { LicenseServiceService } from './licenseService.service'
import { LicenseMapperModule } from './modules/licenseMapper.module'

import {
  LicenseMapperProvider,
  LicenseServiceCacheProvider,
  LoggerProvider,
} from './providers'
import { BarcodeService } from './services/barcode.service'

@Module({
  imports: [LicenseClientModule, LicenseMapperModule, CmsModule],
  providers: [
    LicenseServiceResolver,
    LicenseServiceService,
    BarcodeService,
    LoggerProvider,
    LicenseServiceCacheProvider,
    LicenseMapperProvider,
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
