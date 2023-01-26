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
import { DisabilityLicenseClientApiConfig } from './disabilityLicenseClient.config'
import { DisabilityLicenseClient } from './disabilityLicenseClient.service'

@Module({
  imports: [
    DisabilityLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DisabilityLicenseClientApiConfig>,
      ) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [DisabilityLicenseClientApiConfig.KEY],
    }),
  ],
  providers: [DisabilityLicenseClient, DisabilityLicenseApiProvider],
  exports: [DisabilityLicenseClient],
})
export class DisabilityClientModule {}
