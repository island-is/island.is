import { DynamicModule } from '@nestjs/common'

import { BucketService } from './bucket/bucket.service'
import {
  HEALTH_INSURANCE_CONFIG,
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  SoapClient,
} from './soap'

export class HealthInsuranceModule {
  static register(config: HealthInsuranceConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      providers: [
        SoapClient,
        HealthInsuranceAPI,
        BucketService,
        {
          provide: HEALTH_INSURANCE_CONFIG,
          useValue: config,
        },
      ],
      exports: [HealthInsuranceAPI, SoapClient],
    }
  }
}
