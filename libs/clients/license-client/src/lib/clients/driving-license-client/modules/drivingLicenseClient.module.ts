import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { DrivingLicenseClient } from '../services/drivingLicenseClient.service'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { SmartSolutionsModule } from '@island.is/clients/smart-solutions'

@Module({
  imports: [
    DrivingLicenseApiModule,
    FeatureFlagModule,
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
  providers: [DrivingLicenseClient],
  exports: [DrivingLicenseClient],
})
export class DrivingClientModule {}
