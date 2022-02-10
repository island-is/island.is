import { Module } from '@nestjs/common'
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book'
import { DrivinLicenseBookResolver } from './drivingLicenseBook.resolver'
import { DrivingLicenseBookService } from './drivingLicenseBook.service'

@Module({
  imports: [DrivingLicenseBookClientModule],
  providers: [DrivinLicenseBookResolver, DrivingLicenseBookService],
})
export class DrivingLicenseBookModule {}
