import { DynamicModule } from '@nestjs/common'

import {
  HealthInsuranceAPI,
  HealthInsuranceConfig,
  HEALTH_INSURANCE_CONFIG,
  SoapClient,
} from './soap'
import { BucketService } from './bucket/bucket.service'

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
