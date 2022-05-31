import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { DrivingLicenseBookClientApiFactory } from './drivingLicenseBookClient.service'

// what check bare minimum

@Module({
  providers: [DrivingLicenseBookClientApiFactory],
  exports: [DrivingLicenseBookClientApiFactory],
})
// @Module({
//   providers: [ApiConfiguration, ...exportedApis,DrivingLicenseBookClientApiFactory],
//   exports: [...exportedApis,DrivingLicenseBookClientApiFactory],
// })
export class DrivingLicenseBookClientModule {}
