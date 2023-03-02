import { OpenFirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { FirearmDigitalLicenseClientConfig } from './firearmLicenseClient.config'
import { FirearmLicenseUpdateClient } from './firearmLicenseUpdateClient.service'

@Module({
  imports: [
    OpenFirearmLicenseClientModule,
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
    }),
  ],
  providers: [FirearmLicenseUpdateClient],
  exports: [FirearmLicenseUpdateClient],
})
export class FirearmUpdateClientModule {}
