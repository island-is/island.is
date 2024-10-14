import { Module } from '@nestjs/common'
import { DrivingSchoolConfirmationService } from './driving-school-confirmation.service'
import { DrivingLicenseBookModule } from '@island.is/api/domains/driving-license-book'

@Module({
  imports: [DrivingLicenseBookModule],
  providers: [DrivingSchoolConfirmationService],
  exports: [DrivingSchoolConfirmationService],
})
export class DrivingSchoolConfirmationModule {}
