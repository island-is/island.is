import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { MachineLicenseClient } from './machineLicenseClient.service'
import { MachineLicenseClientApiConfig } from './machineLicenseClient.config'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof MachineLicenseClientApiConfig>,
      ) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [MachineLicenseClientApiConfig.KEY],
    }),
  ],
  providers: [MachineLicenseClient],
  exports: [MachineLicenseClient],
})
export class MachineClientModule {}
