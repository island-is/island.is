import { Module } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'
import {
  LicensesController,
  UserLicensesController,
} from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import { DisabilityLicenseApiClientModule } from './clients/disabilityLicense/disabilityLicenseClient.module'
import { FirearmLicenseApiClientModule } from './clients/firearmLicense/firearmLicenseApiClient.module'
import {
  CLIENT_FACTORY,
  GenericLicenseClient,
  LicenseId,
  PASS_TEMPLATE_IDS,
  PassTemplateIds,
} from './license.types'
import { DisabilityLicenseClientService } from './clients/disabilityLicense/disabilityLicenseClient.service'
import { FirearmLicenseApiClientService } from './clients/firearmLicense/firearmLicenseApiClient.service'
import { ConfigType } from '@nestjs/config'
import { FirearmLicenseApiClientConfig } from './clients/firearmLicense/firearmLicenseApiClient.config'
import { DisabilityLicenseApiClientConfig } from './clients/disabilityLicense/disabilityLicenseClient.config'
import { DrivingLicenseApiClientConfig } from './clients/drivingLicense/drivingLicenseApiClient.config'
import { XRoadConfig } from '@island.is/nest/config'
import { DrivingLicenseApiClientService } from './clients/drivingLicense/drivingLicenseApiClient.service'

@Module({
  imports: [DisabilityLicenseApiClientModule, FirearmLicenseApiClientModule],
  controllers: [LicensesController, UserLicensesController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: PASS_TEMPLATE_IDS,
      useFactory: (
        firearmConfig: ConfigType<typeof FirearmLicenseApiClientConfig>,
        disabilityConfig: ConfigType<typeof DisabilityLicenseApiClientConfig>,
      ) => {
        const ids: PassTemplateIds = {
          firearm: firearmConfig.passTemplateId,
          disability: disabilityConfig.passTemplateId,
        }
        return ids
      },
      inject: [
        FirearmLicenseApiClientConfig.KEY,
        DisabilityLicenseApiClientConfig.KEY,
      ],
    },
    {
      provide: CLIENT_FACTORY,
      useFactory: (
        disabilityClient: DisabilityLicenseClientService,
        firearmClient: FirearmLicenseApiClientService,
        drivingLicenseConfig: ConfigType<typeof DrivingLicenseApiClientConfig>,
        xRoadConfig: ConfigType<typeof XRoadConfig>,
      ) => async (
        type: LicenseId,
        cacheManager: CacheManager,
      ): Promise<GenericLicenseClient | null> => {
        switch (type) {
          case LicenseId.DRIVING_LICENSE:
            return new DrivingLicenseApiClientService(
              logger,
              xRoadConfig,
              drivingLicenseConfig,
              cacheManager,
            )
          case LicenseId.DISABILITY_LICENSE:
            return disabilityClient
          case LicenseId.FIREARM_LICENSE:
            return firearmClient
          default:
            return null
        }
      },
      inject: [
        DisabilityLicenseClientService,
        FirearmLicenseApiClientService,
        DrivingLicenseApiClientConfig.KEY,
        XRoadConfig.KEY,
      ],
    },
    LicenseService,
  ],
})
export class LicenseModule {}
