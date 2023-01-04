import { Module } from '@nestjs/common'
import { LicenseController } from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { DisabilityLicenseClientModule } from './clients/disabilityLicense/disabilityLicenseClient.module'
import { FirearmLicenseClientModule } from './clients/firearmLicense/firearmLicenseClient.module'
import {
  CLIENT_FACTORY,
  GenericLicenseClient,
  LicenseId,
} from './license.types'
import { DisabilityLicenseClientService } from './clients/disabilityLicense/disabilityLicenseClient.service'
import { FirearmLicenseClientService } from './clients/firearmLicense/firearmLicenseClient.service'

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
        disabilityClient: DisabilityLicenseClientService,
        firearmClient: FirearmLicenseClientService,
      ) => async (type: LicenseId): Promise<GenericLicenseClient | null> => {
        switch (type) {
          case LicenseId.DISABILITY_LICENSE:
            return disabilityClient
          case LicenseId.FIREARM_LICENSE:
            return firearmClient
          default:
            return null
        }
      },
      inject: [DisabilityLicenseClientService, FirearmLicenseClientService],
    },
    LicenseService,
  ],
})
export class LicenseModule {}
