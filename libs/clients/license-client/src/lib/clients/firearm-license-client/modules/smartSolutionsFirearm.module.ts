import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'
import { ConfigType } from '@nestjs/config'

export const SmartSolutionsFirearmModule =
  SmartSolutionsApiClientModule.registerAsync({
    useFactory: (
      config: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
    ) => {
      const smartConfig: SmartSolutionsConfig = {
        apiKey: config.apiKey,
        apiUrl: config.apiUrl,
        passTemplateId: config.passTemplateId,
      }
      return smartConfig
    },
    inject: [FirearmDigitalLicenseClientConfig.KEY],
  })
