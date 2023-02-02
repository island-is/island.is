import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'

@Module({
  imports: [
    DrivingLicenseApiModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof GenericAdrLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericAdrLicenseConfig.KEY],
    }),
  ],
  providers: [GenericAdrLicenseService],
  exports: [GenericAdrLicenseService],
})
export class GenericAdrLicenseModule {}
