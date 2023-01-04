import { Module } from '@nestjs/common'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import {
  SmartSolutionsApi,
  SmartSolutionsApiClientModule,
} from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { FirearmLicenseClientConfig } from './firearmLicenseClient.config'
import { FIREARM_API } from '../../license.types'

@Module({
  imports: [
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof FirearmLicenseClientConfig>) =>
        config,
      inject: [FirearmLicenseClientConfig.KEY],
    }),
  ],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    {
      provide: FIREARM_API,
      useFactory: (api: SmartSolutionsApi) => api,
      inject: [SmartSolutionsApi],
    },
  ],
  exports: [FIREARM_API],
})
export class FirearmLicenseClientModule {}
