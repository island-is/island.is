import { Module } from '@nestjs/common'
import { DrivingLicenseBookClientService } from './drivingLicenseBookClient.service'

@Module({
  providers: [DrivingLicenseBookClientService],
  exports: [DrivingLicenseBookClientService],
})
export class DrivingLicenseBookClientModule {}
