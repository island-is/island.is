import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { AdrLicenseClientApiConfig } from './adrLicenseClient.config'
import { AdrLicenseClient } from './adrLicenseClient.service'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof AdrLicenseClientApiConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [AdrLicenseClientApiConfig.KEY],
    }),
  ],
  providers: [AdrLicenseClient],
  exports: [AdrLicenseClient],
})
export class AdrClientModule {}
