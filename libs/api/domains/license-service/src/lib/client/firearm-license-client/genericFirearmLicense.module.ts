import {
  FirearmLicenseApiProvider,
  FirearmLicenseClientModule,
} from '@island.is/clients/firearm-license'
import {
  SmartSolutionsApi,
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
  SMART_SOLUTIONS_API_CONFIG,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { GenericFirearmLicenseService } from './genericFirearmLicense.service'
import { GenericFirearmLicenseConfig } from './genericFirearmLicense.config'

@Module({
  imports: [SmartSolutionsApiClientModule, FirearmLicenseClientModule],
  providers: [
    GenericFirearmLicenseService,
    {
      provide: SMART_SOLUTIONS_API_CONFIG,
      useFactory: (config: ConfigType<typeof GenericFirearmLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericFirearmLicenseConfig.KEY],
    },
    FirearmLicenseApiProvider,
    SmartSolutionsApi,
  ],
  exports: [GenericFirearmLicenseService],
})
export class GenericFirearmLicenseModule {}
