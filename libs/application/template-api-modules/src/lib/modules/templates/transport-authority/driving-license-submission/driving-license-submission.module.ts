import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { DrivingLicenseSubmissionService } from './driving-license-submission.service'
import { DrivingLicenseModule } from '@island.is/api/domains/driving-license'

@Module({
  imports: [SharedTemplateAPIModule, DrivingLicenseModule],
  providers: [DrivingLicenseSubmissionService],
  exports: [DrivingLicenseSubmissionService],
})
export class DrivingLicenseSubmissionModule {}
