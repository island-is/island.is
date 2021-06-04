import { DynamicModule } from '@nestjs/common'

import { HealthInsuranceModule as HealthInsuranceMod } from '@island.is/health-insurance'

import { HealthInsuranceResolver } from './graphql'
import { BucketService } from './bucket.service'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  HEALTH_INSURANCE_CONFIG,
} from './soap'

export class HealthInsuranceModule {
  static register(config: HealthInsuranceConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [HealthInsuranceMod.register(config)],
      providers: [
        BucketService,
        HealthInsuranceService,
        HealthInsuranceResolver,
        HealthInsuranceAPI,
        {
          provide: HEALTH_INSURANCE_CONFIG,
          useValue: config,
        },
      ],
      exports: [],
    }
  }
}
