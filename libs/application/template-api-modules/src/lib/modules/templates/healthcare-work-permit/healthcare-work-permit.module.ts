import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { HealthcareWorkPermitService } from './healthcare-work-permit.service'
import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'
import { InnaClientModule } from '@island.is/clients/inna'

@Module({
  imports: [
    SharedTemplateAPIModule,
    HealthDirectorateClientModule,
    UniversityCareersClientModule,
    InnaClientModule,
  ],
  providers: [HealthcareWorkPermitService],
  exports: [HealthcareWorkPermitService],
})
export class HealthcareWorkPermitModule {}
