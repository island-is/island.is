import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import {
  SmartSolutionsApi,
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
  SMART_SOLUTIONS_API_CONFIG,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { GenericFirearmLicenseConfig } from '../firearm-license-client'
import { GenericMachineLicenseService } from './genericMachineLicense.service'
import { GenericMachineLicenseConfig } from './genericMachineLicense.config'

@Module({
  imports: [SmartSolutionsApiClientModule, AdrAndMachineLicenseClientModule],
  providers: [
    GenericMachineLicenseService,
    {
      provide: SMART_SOLUTIONS_API_CONFIG,
      useFactory: (config: ConfigType<typeof GenericMachineLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericFirearmLicenseConfig.KEY],
    },
    SmartSolutionsApi,
  ],
  exports: [GenericMachineLicenseService],
})
export class GenericMachineLicenseModule {}
