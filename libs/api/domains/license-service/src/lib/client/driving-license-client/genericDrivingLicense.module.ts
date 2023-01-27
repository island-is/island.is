import { CacheModule, Module } from '@nestjs/common'
import { GenericDrivingLicenseApi } from './drivingLicenseService.api'
import { ConfigType } from '@nestjs/config'
import { GenericDrivingLicenseConfig } from './genericDrivingLicense.config'
import { XRoadConfig } from '@island.is/nest/config'
import { Cache as CacheManager } from 'cache-manager'
import {
  DRIVING_LICENSE_FACTORY,
  GenericLicenseClient,
} from '../../licenceService.type'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

@Module({
  providers: [
    {
      provide: DRIVING_LICENSE_FACTORY,
      useFactory: (
        drivingLicenseConfig: ConfigType<typeof GenericDrivingLicenseConfig>,
        xRoadConfig: ConfigType<typeof XRoadConfig>,
        logger: Logger,
      ) => async (
        cacheManager: CacheManager,
      ): Promise<GenericLicenseClient<unknown> | null> =>
        new GenericDrivingLicenseApi(
          logger,
          xRoadConfig,
          drivingLicenseConfig,
          cacheManager,
        ),
      inject: [
        GenericDrivingLicenseConfig.KEY,
        XRoadConfig.KEY,
        LOGGER_PROVIDER,
      ],
    },
  ],
  exports: [DRIVING_LICENSE_FACTORY],
})
export class GenericDrivingLicenseModule {}
