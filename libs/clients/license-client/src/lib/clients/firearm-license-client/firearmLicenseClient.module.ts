import { FirearmLicenseClientModule } from '@island.is/clients/firearm-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { FirearmLicenseClient } from './firearmLicenseClient.service'
import { FirearmDigitalLicenseConfig } from './firearmLicenseClient.config'

@Module({
  imports: [
    FirearmLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof FirearmDigitalLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [FirearmDigitalLicenseConfig.KEY],
    }),
  ],
  providers: [FirearmLicenseClient],
  exports: [FirearmLicenseClient],
})
export class FirearmClientModule {}
