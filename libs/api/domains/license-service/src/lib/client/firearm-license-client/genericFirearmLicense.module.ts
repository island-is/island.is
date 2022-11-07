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
import { GenericFirearmLicenseService } from './genericFirearmLicense.service'
import { GenericFirearmLicenseConfig } from './genericFirearmLicense.config'

@Module({
  imports: [
    FirearmLicenseClientModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof GenericFirearmLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericFirearmLicenseConfig.KEY],
    }),
  ],
  providers: [GenericFirearmLicenseService, FirearmLicenseApiProvider],
  exports: [GenericFirearmLicenseService],
})
export class GenericFirearmLicenseModule {}
