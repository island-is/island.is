import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { DrivingLicenseClient } from '../services/drivingLicenseClient.service'
import { Module } from '@nestjs/common'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { smartSolutionsModuleFactory } from '../../../factories/smartSolutionsModuleFactory'

@Module({
  imports: [
    DrivingLicenseApiModule,
    FeatureFlagModule,
    smartSolutionsModuleFactory(DrivingDigitalLicenseClientConfig),
  ],
  providers: [DrivingLicenseClient],
  exports: [DrivingLicenseClient],
})
export class DrivingClientModule {}
