import { Module } from '@nestjs/common'
import { DrivingLicenseApiClientService } from './drivingLicenseApiClient.service'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DrivingLicenseApiClientConfig } from './drivingLicenseApiClient.config'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

@Module({
  imports: [
    DrivingLicenseApiModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (config: ConfigType<typeof DrivingLicenseApiClientConfig>) =>
        config,
      inject: [DrivingLicenseApiClientConfig.KEY],
    }),
  ],
  providers: [DrivingLicenseApiClientService],
  exports: [DrivingLicenseApiClientService],
})
export class DrivingLicenseApiClientModule {}
