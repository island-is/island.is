import { Module } from '@nestjs/common'
import { LicenseController } from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { DisabilityLicenseApiClientModule } from './clients/disabilityLicense/disabilityLicenseClient.module'
import { FirearmLicenseApiClientModule } from './clients/firearmLicense/firearmLicenseApiClient.module'
import {
  CLIENT_FACTORY,
  GenericLicenseClient,
  LicenseId,
} from './license.types'
import { DisabilityLicenseClientService } from './clients/disabilityLicense/disabilityLicenseClient.service'
import { FirearmLicenseApiClientService } from './clients/firearmLicense/firearmLicenseApiClient.service'

@Module({
  imports: [DisabilityLicenseApiClientModule, FirearmLicenseApiClientModule],
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
        firearmClient: FirearmLicenseApiClientService,
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
      inject: [DisabilityLicenseClientService, FirearmLicenseApiClientService],
    },
    LicenseService,
  ],
})
export class LicenseModule {}
