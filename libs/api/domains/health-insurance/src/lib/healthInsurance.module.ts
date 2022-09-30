import { DynamicModule } from '@nestjs/common'

import {
  HealthInsuranceAccidentNotificationResolver,
  HealthInsuranceResolver,
} from './graphql'
import { BucketService } from './bucket.service'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  DocumentApi,
  HealthInsuranceV2Client,
  HealthInsuranceV2Options,
  PersonApi,
  TestApi,
} from '@island.is/clients/health-insurance-v2'
import { AccidentNotificationService } from './accident-notification.service'
import { HealthInsuranceRESTAPI } from './rest'

export interface HealthInsuranceOptions {
  clientV2Config: HealthInsuranceV2Options
}

export class HealthInsuranceModule {
  static register(options: HealthInsuranceOptions): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [HealthInsuranceV2Client.register(options.clientV2Config)],
      providers: [
        BucketService,
        HealthInsuranceService,
        HealthInsuranceResolver,
        HealthInsuranceAccidentNotificationResolver,
        AccidentNotificationService,
        HealthInsuranceRESTAPI,
        PersonApi,
        TestApi,
        DocumentApi,
      ],
      exports: [],
    }
  }
}
