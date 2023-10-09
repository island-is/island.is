import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { CacheModule, CACHE_MANAGER } from '@nestjs/cache-manager'
import { ConfigType } from '@island.is/nest/config'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { GenericDrivingLicenseConfig } from './genericDrivingLicense.config'
import { GenericDrivingLicenseService } from './genericDrivingLicense.service'
import { PkPassClient } from './pkpass.client'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Cache as CacheManager } from 'cache-manager'

@Module({
  imports: [
    CacheModule.register(),
    DrivingLicenseApiModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof GenericDrivingLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericDrivingLicenseConfig.KEY],
    }),
  ],
  providers: [
    GenericDrivingLicenseService,
    {
      provide: PkPassClient,
      useFactory: (
        config: ConfigType<typeof GenericDrivingLicenseConfig>,
        logger: Logger,
        cacheManager: CacheManager,
      ) => {
        return new PkPassClient(config, logger, cacheManager)
      },
      inject: [GenericDrivingLicenseConfig.KEY, LOGGER_PROVIDER, CACHE_MANAGER],
    },
  ],
  exports: [GenericDrivingLicenseService],
})
export class GenericDrivingLicenseModule {}
