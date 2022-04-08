import { Module } from '@nestjs/common'
import { ApiV1 } from '../v1'
import { DrivingLicenseApi } from './drivingLicenseApi.service'
import { DrivingLicenseApiProvider } from './apiConfiguration'

@Module({
  providers: [DrivingLicenseApiProvider],
  exports: [DrivingLicenseApi],
})
export class DrivingLicenseApiModule {}
