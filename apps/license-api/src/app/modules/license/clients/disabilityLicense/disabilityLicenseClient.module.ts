import { Module } from '@nestjs/common'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import {
  SmartSolutionsApi,
  SmartSolutionsApiClientModule,
} from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DisabilityLicenseClientConfig } from './disabilityLicenseClient.config'
import { DISABILITY_API } from '../../license.types'

@Module({
  imports: [
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof DisabilityLicenseClientConfig>) =>
        config,
      inject: [DisabilityLicenseClientConfig.KEY],
    }),
  ],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: DISABILITY_API,
      useFactory: (api: SmartSolutionsApi) => api,
      inject: [SmartSolutionsApi],
    },
  ],
  exports: [DISABILITY_API],
})
export class DisabilityLicenseClientModule {}
