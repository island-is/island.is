import { Module } from '@nestjs/common'
import { DrivingLicenseBookClientApiFactory } from './drivingLicenseBookClient.service'

@Module({
  providers: [DrivingLicenseBookClientApiFactory],
  exports: [DrivingLicenseBookClientApiFactory],
})
export class DrivingLicenseBookClientModule {}
