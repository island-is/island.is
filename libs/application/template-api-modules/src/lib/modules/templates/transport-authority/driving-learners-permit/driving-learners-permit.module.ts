import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { DrivingLearnersPermitService } from './driving-learners-permit.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

@Module({
  imports: [DrivingLicenseApiModule, SharedTemplateAPIModule],
  providers: [DrivingLearnersPermitService],
  exports: [DrivingLearnersPermitService],
})
export class DrivingLearnersPermitModule {}
