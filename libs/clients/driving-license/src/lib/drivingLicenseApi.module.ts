import { Module } from '@nestjs/common'
import { DrivingLicenseApi } from './services/drivingLicenseApi.service'
import { exportedApis } from './apiConfiguration'
import { PenaltyPointsService } from './services/penaltyPoints.service'

@Module({
  providers: [...exportedApis, DrivingLicenseApi],
  exports: [DrivingLicenseApi, PenaltyPointsService],
})
export class DrivingLicenseApiModule {}
