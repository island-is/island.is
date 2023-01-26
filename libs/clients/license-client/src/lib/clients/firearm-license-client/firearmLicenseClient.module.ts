import {
  FirearmLicenseApiProvider,
  FirearmLicenseClientModule,
} from '@island.is/clients/firearm-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { FirearmLicenseClient } from './firearmLicenseClient.service'
import { FirearmLicenseClientApiConfig } from './firearmLicenseClient.config'

@Module({
  imports: [
    FirearmLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof FirearmLicenseClientApiConfig>,
      ) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [FirearmLicenseClientApiConfig.KEY],
    }),
  ],
  providers: [FirearmLicenseClient, FirearmLicenseApiProvider],
  exports: [FirearmLicenseClient],
})
export class FirearmClientModule {}
