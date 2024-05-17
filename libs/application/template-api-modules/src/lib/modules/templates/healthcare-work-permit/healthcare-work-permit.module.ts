import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { HealthcareWorkPermitService } from './healthcare-work-permit.service'
import {
  HealthDirectorateClientModule,
  HealthDirectorateClientConfig,
} from '@island.is/clients/health-directorate'
import {
  UniversityCareersClientModule,
  UniversityOfIcelandCareerClientConfig,
} from '@island.is/clients/university-careers'
import {
  NationalRegistryClientConfig,
  NationalRegistryClientModule,
} from '@island.is/clients/national-registry-v2'

export class HealthcareWorkPermitModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthcareWorkPermitModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        HealthDirectorateClientModule,
        UniversityCareersClientModule,
        NationalRegistryClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            HealthDirectorateClientConfig,
            UniversityOfIcelandCareerClientConfig,
            NationalRegistryClientConfig,
          ],
        }),
      ],
      providers: [HealthcareWorkPermitService],
      exports: [HealthcareWorkPermitService],
    }
  }
}
