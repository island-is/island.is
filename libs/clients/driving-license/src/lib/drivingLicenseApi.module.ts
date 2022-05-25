import { Module } from '@nestjs/common'
import { DrivingLicenseApi } from './drivingLicenseApi.service'
import { exportedApis } from './apiConfiguration'

@Module({
  providers: [...exportedApis, DrivingLicenseApi],
  exports: [DrivingLicenseApi],
})
export class DrivingLicenseApiModule {}
