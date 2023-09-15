import { Module } from '@nestjs/common'
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book'
import { DrivingLicenseBookResolver } from './drivingLicenseBook.resolver'
import { DrivingLicenseBookService } from './drivingLicenseBook.service'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'

@Module({
  imports: [DrivingLicenseBookClientModule, DrivingLicenseModule],
  providers: [DrivingLicenseBookResolver, DrivingLicenseBookService],
  exports: [DrivingLicenseBookService],
})
export class DrivingLicenseBookModule {}
