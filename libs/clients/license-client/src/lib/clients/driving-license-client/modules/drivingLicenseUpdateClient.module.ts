import { Module } from '@nestjs/common'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DrivingLicenseUpdateClient } from '../services/drivingLicenseUpdateClient.service'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'

@Module({
  imports: [
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
      ) => config,
      inject: [DrivingDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [DrivingLicenseUpdateClient],
  exports: [DrivingLicenseUpdateClient],
})
export class DrivingUpdateClientModule {}
