import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { GenericDrivingLicenseConfig } from './genericDrivingLicense.config'
import { GenericDrivingLicenseService } from './genericDrivingLicense.service'

@Module({
  imports: [
    DrivingLicenseApiModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof GenericDrivingLicenseConfig>) => {
        const smartConfig: SmartSolutionsConfig = {
          apiKey: config.apiKey,
          apiUrl: config.apiUrl,
          passTemplateId: config.passTemplateId,
        }
        return smartConfig
      },
      inject: [GenericDrivingLicenseConfig.KEY],
    }),
  ],
  providers: [GenericDrivingLicenseService],
  exports: [GenericDrivingLicenseService],
})
export class GenericDrivingLicenseModule {}
