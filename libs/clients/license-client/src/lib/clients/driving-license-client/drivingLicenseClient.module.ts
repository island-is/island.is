import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { Cache as CacheManager } from 'cache-manager'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { DrivingLicenseClient } from './drivingLicenseClient.service'
import { DrivingDigitalLicenseConfig } from './drivingLicenseClient.config'
import { LicenseClient } from '../../licenseClient.type'
import { DRIVING_LICENSE_CLIENT_FACTORY } from './drivingLicenseClient.type'

@Module({
  providers: [
    {
      provide: DRIVING_LICENSE_CLIENT_FACTORY,
      useFactory: (
        drivingLicenseConfig: ConfigType<typeof DrivingDigitalLicenseConfig>,
        xRoadConfig: ConfigType<typeof XRoadConfig>,
        logger: Logger,
      ) => async (
        cacheManager: CacheManager,
      ): Promise<LicenseClient<unknown> | null> =>
        new DrivingLicenseClient(
          logger,
          xRoadConfig,
          drivingLicenseConfig,
          cacheManager,
        ),
      inject: [
        DrivingDigitalLicenseConfig.KEY,
        XRoadConfig.KEY,
        LOGGER_PROVIDER,
      ],
    },
  ],
  exports: [DRIVING_LICENSE_CLIENT_FACTORY],
})
export class DrivingClientModule {}
