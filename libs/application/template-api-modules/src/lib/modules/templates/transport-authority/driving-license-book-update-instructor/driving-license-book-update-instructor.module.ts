import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { DrivingLicenseBookUpdateInstructorService } from './driving-license-book-update-instructor.service'
import { DrivingLicenseBookClientModule } from '@island.is/clients/driving-license-book'

@Module({
  imports: [SharedTemplateAPIModule, DrivingLicenseBookClientModule],
  providers: [DrivingLicenseBookUpdateInstructorService],
  exports: [DrivingLicenseBookUpdateInstructorService],
})
export class DrivingLicenseBookUpdateInstructorModule {}
