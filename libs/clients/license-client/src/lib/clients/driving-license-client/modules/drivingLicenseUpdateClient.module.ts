import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { DrivingLicenseUpdateClient } from '../services/drivingLicenseUpdateClient.service'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions'

@Module({
  imports: [
    DrivingLicenseApiModule,
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
      ) => {
        return {
          config,
        }
      },
      inject: [DrivingDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [DrivingLicenseUpdateClient],
  exports: [DrivingLicenseUpdateClient],
})
export class DrivingUpdateClientModule {}
