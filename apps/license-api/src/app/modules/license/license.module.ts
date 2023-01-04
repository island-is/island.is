import { Module } from '@nestjs/common'
import { LicenseController } from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { SmartSolutionsApi } from '@island.is/clients/smartsolutions'
import { DisabilityLicenseClientModule } from './clients/disabilityLicense/disabilityLicenseClient.module'
import { FirearmLicenseClientModule } from './clients/firearmLicense/firearmLicenseClient.module'
import {
  CLIENT_FACTORY,
  DISABILITY_API,
  FIREARM_API,
  LicenseId,
} from './license.types'

@Module({
  imports: [DisabilityLicenseClientModule, FirearmLicenseClientModule],
  controllers: [LicenseController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: CLIENT_FACTORY,
      useFactory: (
        firearmApi: SmartSolutionsApi,
        disabilityApi: SmartSolutionsApi,
      ) => async (type: LicenseId): Promise<SmartSolutionsApi | null> => {
        switch (type) {
          case LicenseId.DISABILITY_LICENSE:
            return disabilityApi
          case LicenseId.FIREARM_LICENSE:
            return firearmApi
          default:
            return null
        }
      },
      inject: [FIREARM_API, DISABILITY_API],
    },
    LicenseService,
  ],
})
export class LicenseModule {}
