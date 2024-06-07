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
  NationalRegistryV3ClientConfig,
  NationalRegistryV3ClientModule,
} from '@island.is/clients/national-registry-v3'
import {
  AgriculturalUniversityOfIcelandCareerClientConfig,
  BifrostUniversityCareerClientConfig,
  HolarUniversityCareerClientConfig,
  IcelandUniversityOfTheArtsCareerClientConfig,
  UniversityCareersClientModule,
  UniversityOfAkureyriCareerClientConfig,
  UniversityOfIcelandCareerClientConfig,
} from '@island.is/clients/university-careers'

export class HealthcareWorkPermitModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthcareWorkPermitModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        HealthDirectorateClientModule,
        NationalRegistryV3ClientModule,
        UniversityCareersClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            HealthDirectorateClientConfig,
            NationalRegistryV3ClientConfig,
            AgriculturalUniversityOfIcelandCareerClientConfig,
            BifrostUniversityCareerClientConfig,
            UniversityOfAkureyriCareerClientConfig,
            UniversityOfIcelandCareerClientConfig,
            HolarUniversityCareerClientConfig,
            IcelandUniversityOfTheArtsCareerClientConfig,
          ],
        }),
      ],
      providers: [HealthcareWorkPermitService],
      exports: [HealthcareWorkPermitService],
    }
  }
}
