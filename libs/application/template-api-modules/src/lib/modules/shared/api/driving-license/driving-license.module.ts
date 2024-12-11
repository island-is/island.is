import { Module } from '@nestjs/common'
import { DrivingLicenseProviderService } from './driving-license.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'

@Module({
  imports: [DrivingLicenseApiModule, DrivingLicenseBookModule],
  providers: [DrivingLicenseProviderService],
  exports: [DrivingLicenseProviderService],
})
export class DrivingLicenseModule {}
