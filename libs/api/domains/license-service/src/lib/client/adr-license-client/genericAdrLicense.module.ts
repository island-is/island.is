import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import {
  SmartSolutionsApi,
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
  SMART_SOLUTIONS_API_CONFIG,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { GenericAdrLicenseService } from './genericAdrLicense.service'
import { GenericAdrLicenseConfig } from './genericAdrLicense.config'
import { LazyDuringDevScope } from '@island.is/nest/config'

@Module({
  imports: [SmartSolutionsApiClientModule, AdrAndMachineLicenseClientModule],
  providers: [
    GenericAdrLicenseService,
    {
      provide: SMART_SOLUTIONS_API_CONFIG,
      scope: LazyDuringDevScope,
      useFactory: (config: ConfigType<typeof GenericAdrLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericAdrLicenseConfig.KEY],
    },
    SmartSolutionsApi,
  ],
  exports: [GenericAdrLicenseService],
})
export class GenericAdrLicenseModule {}
