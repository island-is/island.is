import {
  DisabilityLicenseApiProvider,
  DisabilityLicenseClientModule,
} from '@island.is/clients/disability-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { GenericDisabilityLicenseService } from './genericDisabilityLicense.service'
import { GenericDisabilityLicenseConfig } from './genericDisabilityLicense.config'

@Module({
  imports: [
    DisabilityLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof GenericDisabilityLicenseConfig>,
      ) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericDisabilityLicenseConfig.KEY],
    }),
  ],
  providers: [GenericDisabilityLicenseService, DisabilityLicenseApiProvider],
  exports: [GenericDisabilityLicenseService],
})
export class GenericDisabilityLicenseModule {}
