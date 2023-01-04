import { Module } from '@nestjs/common'
import { LicenseController } from './license.controller'
import { LicenseService } from './license.service'
import { LOGGER_PROVIDER, logger } from '@island.is/logging'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { FirearmLicenseClientConfig } from './config/firearmLicenseClient.config'

@Module({
  imports: [
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof FirearmLicenseClientConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [FirearmLicenseClientConfig.KEY],
    }),
  ],
  controllers: [LicenseController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    LicenseService,
  ],
})
export class LicenseModule {}
