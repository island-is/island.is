import { Module } from '@nestjs/common'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { FishingLicenseService } from './fishing-license-service'

@Module({
  exports: [...exportedApis, FishingLicenseService],
  providers: [ApiConfiguration, ...exportedApis, FishingLicenseService],
})
export class FishingLicenseClientModule {}
