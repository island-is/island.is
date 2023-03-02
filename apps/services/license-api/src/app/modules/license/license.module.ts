import { Module } from '@nestjs/common'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { LicenseUpdateClientModule } from '@island.is/clients/license-client'
import {
  LicensesController,
  UserLicensesController,
} from './license.controller'
import { LicenseService } from './license.service'
@Module({
  imports: [LicenseUpdateClientModule],
  controllers: [LicensesController, UserLicensesController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    LicenseService,
  ],
})
export class LicenseModule {}
