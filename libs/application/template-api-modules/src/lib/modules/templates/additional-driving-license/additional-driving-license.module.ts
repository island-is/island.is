import { Module } from '@nestjs/common'

// Shared module — gives access to createCharge/getPaymentStatus/sendEmail etc.
import { SharedTemplateAPIModule } from '../../shared'
import { AdditionalDrivingLicenseService } from './additional-driving-license.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [AdditionalDrivingLicenseService],
  exports: [AdditionalDrivingLicenseService],
})
export class AdditionalDrivingLicenseModule {}
