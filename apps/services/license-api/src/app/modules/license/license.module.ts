import { LicenseUpdateClientModule } from '@island.is/clients/license-client'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { LicenseModule as LicenseCommonModule } from '@island.is/services/license'
import { Module } from '@nestjs/common'
import {
  LicensesControllerV1,
  LicensesControllerV2,
  UserLicensesControllerV1,
  UserLicensesControllerV2,
} from './controllers'
import { LicenseServiceV1, LicenseServiceV2 } from './services'

@Module({
  imports: [LicenseUpdateClientModule, LicenseCommonModule],
  controllers: [
    LicensesControllerV1,
    LicensesControllerV2,
    UserLicensesControllerV1,
    UserLicensesControllerV2,
  ],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    LicenseServiceV1,
    LicenseServiceV2,
  ],
})
export class LicenseModule {}
