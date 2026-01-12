import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../../shared'

// Here you import your module service
import { HealthInsuranceService } from './health-insurance.service'
import { HealthInsuranceV2ClientModule } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [HealthInsuranceV2ClientModule, SharedTemplateAPIModule, AwsModule],
  providers: [HealthInsuranceService],
  exports: [HealthInsuranceService],
})
export class HealthInsuranceModule {}
