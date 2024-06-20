import { LicenseClientModule } from '@island.is/clients/license-client'
<<<<<<< Updated upstream
import { CmsTranslationsModule } from '@island.is/cms-translations'
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
import { CmsModule } from '@island.is/cms'
=======
>>>>>>> Stashed changes
import { LicenseModule } from '@island.is/services/license'
import { Module } from '@nestjs/common'

import { LicenseServiceResolver } from './licenseService.resolver'
import { LicenseServiceService } from './licenseService.service'
import { LicenseMapperModule } from './mappers/licenseMapper.module'

import { LicenseMapperProvider, LoggerProvider } from './providers'

@Module({
<<<<<<< Updated upstream
  imports: [
    LicenseClientModule,
    LicenseMapperModule,
    CmsModule,
    CmsTranslationsModule,
    LicenseModule,
    CacheModule.register({
      ttl: 60 * 10 * 1000, // 10 minutes
    }),
  ],
=======
  imports: [LicenseClientModule, LicenseMapperModule, LicenseModule],
>>>>>>> Stashed changes
  providers: [
    LicenseServiceResolver,
    LicenseServiceService,
    LoggerProvider,
    LicenseMapperProvider,
  ],
  exports: [LicenseServiceService],
})
export class LicenseServiceModule {}
