import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { HealthcareWorkPermitService } from './healthcare-work-permit.service'
import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { UniversityCareersClientModule } from '@island.is/clients/university-careers'

export class HealthcareWorkPermitModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthcareWorkPermitModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        HealthDirectorateClientModule,
        UniversityCareersClientModule,
      ],
      providers: [HealthcareWorkPermitService],
      exports: [HealthcareWorkPermitService],
    }
  }
}
