import { Inject, Module } from '@nestjs/common'
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { OldGenericDrivingLicenseConfig } from './oldGenericDrivingLicense.config'
import { OldGenericDrivingLicenseApi } from './oldGenericDrivingLicense.service'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Cache as CacheManager } from 'cache-manager'
import { GenericLicenseClient } from '../../licenceService.type'

@Module({
  imports: [CacheModule.register()],
  providers: [
    {
      provide: OldGenericDrivingLicenseApi,
      useFactory: (
        drivingLicenseConfig: ConfigType<typeof OldGenericDrivingLicenseConfig>,
        xRoadConfig: ConfigType<typeof XRoadConfig>,
        logger: Logger,
        cacheManager: CacheManager,
      ): GenericLicenseClient<unknown> =>
        new OldGenericDrivingLicenseApi(
          logger,
          xRoadConfig,
          drivingLicenseConfig,
          cacheManager,
        ),
      inject: [
        OldGenericDrivingLicenseConfig.KEY,
        XRoadConfig.KEY,
        LOGGER_PROVIDER,
        CACHE_MANAGER,
      ],
    },
  ],
  exports: [OldGenericDrivingLicenseApi],
})
export class OldGenericDrivingLicenseModule {}
