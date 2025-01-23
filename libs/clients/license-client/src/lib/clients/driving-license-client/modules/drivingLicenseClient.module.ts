import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { DrivingLicenseClient } from '../services/drivingLicenseClient.service'
import { Module } from '@nestjs/common'
import { SmartSolutionsApiClientModule } from '@island.is/clients/smartsolutions'
import { ConfigType } from '@nestjs/config'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    FeatureFlagModule,
    DrivingLicenseApiModule,
    SmartSolutionsApiClientModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
      ) => config,
      inject: [DrivingDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [DrivingLicenseClient],
  exports: [DrivingLicenseClient],
})
export class DrivingClientModule {}
