import { Module } from '@nestjs/common'

// Shared module — gives access to createCharge/getPaymentStatus/sendEmail etc.
import { SharedTemplateAPIModule } from '../../shared'
import { DrivingLicenseAdditionalService } from './driving-license-additional.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [DrivingLicenseAdditionalService],
  exports: [DrivingLicenseAdditionalService],
})
export class DrivingLicenseAdditionalModule {}
