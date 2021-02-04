import { DynamicModule } from '@nestjs/common'

import { HealthInsuranceResolver } from './graphql'
import { BucketService } from './graphql/bucket.service'
import { TestResolver } from './graphql/test.resolver'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  HEALTH_INSURANCE_CONFIG,
  SoapClient,
} from './soap'

export class HealthInsuranceModule {
  static register(config: HealthInsuranceConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      providers: [
        BucketService,
        HealthInsuranceService,
        HealthInsuranceResolver,
        TestResolver,
        SoapClient,
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
