import { Module } from '@nestjs/common'
import { DrivingLicenseApi } from './services/drivingLicenseApi.service'
import { exportedApis } from './apiConfiguration'
import { PenaltyPointsClientService } from './services/penaltyPoints.service'

@Module({
  providers: [...exportedApis, DrivingLicenseApi, PenaltyPointsClientService],
  exports: [DrivingLicenseApi, PenaltyPointsClientService],
})
export class DrivingLicenseApiModule {}
