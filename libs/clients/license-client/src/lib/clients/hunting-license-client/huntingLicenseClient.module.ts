import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { HuntingDigitalLicenseClientConfig } from './huntingLicenseClient.config'
import { HuntingLicenseClient } from './huntingLicenseClient.service'
import { NvsPermitsClientModule } from '@island.is/clients/nvs-permits'

@Module({
  imports: [
    NvsPermitsClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof HuntingDigitalLicenseClientConfig>,
      ) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [HuntingDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [HuntingLicenseClient],
  exports: [HuntingLicenseClient],
})
export class HuntingClientModule {}
