import { Module } from '@nestjs/common'
// import { ApiConfiguration } from './apiConfiguration'
// import { exportedApis } from './apis'
import { DrivingLicenseBookClientService } from './drivingLicenseBookClient.service'

@Module({
  providers: [DrivingLicenseBookClientService],
  exports: [DrivingLicenseBookClientService],
})
export class DrivingLicenseBookClientModule {}
