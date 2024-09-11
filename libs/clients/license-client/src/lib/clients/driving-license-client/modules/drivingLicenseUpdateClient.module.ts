import { Module } from '@nestjs/common'
import { DrivingLicenseUpdateClient } from '../services/drivingLicenseUpdateClient.service'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { smartSolutionsModuleFactory } from '../../../factories/smartSolutionsModuleFactory'

@Module({
  imports: [
    DrivingLicenseApiModule,
    smartSolutionsModuleFactory(DrivingDigitalLicenseClientConfig),
  ],
  providers: [DrivingLicenseUpdateClient],
  exports: [DrivingLicenseUpdateClient],
})
export class DrivingUpdateClientModule {}
