import { DynamicModule } from '@nestjs/common'

// import { BucketService } from './bucket.service'
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
        // BucketService,
        SoapClient,
        HealthInsuranceAPI,
        {
          provide: HEALTH_INSURANCE_CONFIG,
          useValue: config,
        },
      ],
      exports: [HealthInsuranceAPI],
    }
  }
}
