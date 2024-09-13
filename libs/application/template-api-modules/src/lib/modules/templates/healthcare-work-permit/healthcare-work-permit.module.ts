import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { HealthcareWorkPermitService } from './healthcare-work-permit.service'
import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'

@Module({
  imports: [
    SharedTemplateAPIModule,
    HealthDirectorateClientModule,
    UniversityCareersClientModule,
  ],
  providers: [HealthcareWorkPermitService],
  exports: [HealthcareWorkPermitService],
})
export class HealthcareWorkPermitModule {}
