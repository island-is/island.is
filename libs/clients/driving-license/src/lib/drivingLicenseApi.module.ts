import { Module } from '@nestjs/common'
import { DrivingLicenseApi } from './services/drivingLicenseApi.service'
import { exportedApis } from './apiConfiguration'
<<<<<<< HEAD
import { PenaltyPointsClientService } from './services/penaltyPoints.service'

@Module({
  providers: [...exportedApis, DrivingLicenseApi, PenaltyPointsClientService],
  exports: [DrivingLicenseApi, PenaltyPointsClientService],
=======
import { PenaltyPointsService } from './services/penaltyPoints.service'

@Module({
  providers: [...exportedApis, DrivingLicenseApi],
  exports: [DrivingLicenseApi, PenaltyPointsService],
>>>>>>> dcd05399b4 (chore: update api)
})
export class DrivingLicenseApiModule {}
