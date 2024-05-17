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
  UniversityOfIcelandClientConfig,
  UniversityOfIcelandClientModule,
} from '@island.is/clients/university-of-iceland'
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
        UniversityOfIcelandClientModule,
        NationalRegistryClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            HealthDirectorateClientConfig,
            UniversityOfIcelandClientConfig,
            NationalRegistryClientConfig,
          ],
        }),
      ],
      providers: [HealthcareWorkPermitService],
      exports: [HealthcareWorkPermitService],
    }
  }
}
