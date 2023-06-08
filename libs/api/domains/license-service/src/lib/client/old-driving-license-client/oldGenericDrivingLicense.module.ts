import { CACHE_MANAGER, CacheModule, Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { OldGenericDrivingLicenseConfig } from './oldGenericDrivingLicense.config'
import { OldGenericDrivingLicenseApi } from './oldGenericDrivingLicense.service'
import { OldPkPassClient } from './oldPkpass.client'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Cache as CacheManager } from 'cache-manager'

@Module({
  imports: [CacheModule.register()],
  providers: [
    OldGenericDrivingLicenseApi,
    {
      provide: OldPkPassClient,
      useFactory: (
        config: ConfigType<typeof OldGenericDrivingLicenseConfig>,
        logger: Logger,
        cacheManager: CacheManager,
      ) => {
        return new OldPkPassClient(config, logger, cacheManager)
      },
      inject: [
        OldGenericDrivingLicenseConfig.KEY,
        LOGGER_PROVIDER,
        CACHE_MANAGER,
      ],
    },
  ],
  exports: [OldGenericDrivingLicenseApi],
})
export class OldGenericDrivingLicenseModule {}
