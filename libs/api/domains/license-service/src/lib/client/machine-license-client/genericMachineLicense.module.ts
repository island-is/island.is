import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { GenericMachineLicenseService } from './genericMachineLicense.service'
import { GenericMachineLicenseConfig } from './genericMachineLicense.config'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof GenericMachineLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericMachineLicenseConfig.KEY],
    }),
  ],
  providers: [GenericMachineLicenseService],
  exports: [GenericMachineLicenseService],
})
export class GenericMachineLicenseModule {}
