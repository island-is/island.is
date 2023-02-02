import { Module } from '@nestjs/common'
import { GenericDrivingLicenseApi } from './drivingLicenseService.api'
import { ConfigType } from '@nestjs/config'
import { GenericDrivingLicenseConfig } from './genericDrivingLicense.config'
import { XRoadConfig } from '@island.is/nest/config'
import { GenericLicenseClient } from '../../licenceService.type'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import {
  SmartSolutionsApi,
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'

@Module({
  imports: [
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
    {
      provide: GenericDrivingLicenseApi,
      useFactory: (
        drivingLicenseConfig: ConfigType<typeof GenericDrivingLicenseConfig>,
        xRoadConfig: ConfigType<typeof XRoadConfig>,
        logger: Logger,
        smartApi: SmartSolutionsApi,
      ) => async (): Promise<GenericLicenseClient<unknown> | null> =>
        new GenericDrivingLicenseApi(
          logger,
          xRoadConfig,
          drivingLicenseConfig,
          smartApi,
        ),
      inject: [
        GenericDrivingLicenseConfig.KEY,
        XRoadConfig.KEY,
        LOGGER_PROVIDER,
        SmartSolutionsApi,
      ],
    },
  ],
  exports: [GenericDrivingLicenseApi],
})
export class GenericDrivingLicenseModule {}
