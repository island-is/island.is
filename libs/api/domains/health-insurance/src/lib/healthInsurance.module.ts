import { DynamicModule } from '@nestjs/common'

import {
  HealthInsuranceV2Client,
  HealthInsuranceV2Options,
} from '@island.is/clients/health-insurance-v2'
import { HealthInsuranceModule as HealthInsuranceMod } from '@island.is/health-insurance'

import { AccidentNotificationService } from './accident-notification.service'
import { BucketService } from './bucket.service'
import {
  HealthInsuranceAccidentNotificationResolver,
  HealthInsuranceResolver,
} from './graphql'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  HEALTH_INSURANCE_CONFIG,
  HealthInsuranceAPI,
  HealthInsuranceConfig,
} from './soap'

export interface HealthInsuranceOptions {
  soapConfig: HealthInsuranceConfig
  clientV2Config: HealthInsuranceV2Options
}

export class HealthInsuranceModule {
  static register(options: HealthInsuranceOptions): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [
        HealthInsuranceMod.register(options.soapConfig),
        HealthInsuranceV2Client.register(options.clientV2Config),
      ],
      providers: [
        BucketService,
        HealthInsuranceService,
        HealthInsuranceResolver,
        HealthInsuranceAPI,
        HealthInsuranceAccidentNotificationResolver,
        AccidentNotificationService,
        {
          provide: HEALTH_INSURANCE_CONFIG,
          useValue: options.soapConfig,
        },
      ],
      exports: [],
    }
  }
}
