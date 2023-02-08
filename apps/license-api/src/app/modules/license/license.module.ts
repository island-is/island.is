import { Module } from '@nestjs/common'
import { LicenseController } from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { LicenseClientModule } from '@island.is/clients/license-client'

@Module({
  imports: [LicenseClientModule],
  controllers: [LicenseController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    LicenseService,
  ],
})
export class LicenseModule {}
