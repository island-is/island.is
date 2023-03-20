import { DynamicModule } from '@nestjs/common'
import {
  HealthInsuranceAccidentNotificationResolver,
  HealthInsuranceResolver,
} from './graphql'
import { HealthInsuranceService } from './healthInsurance.service'
import {
  HealthInsuranceV2Client,
  HealthInsuranceV2Options,
} from '@island.is/clients/health-insurance-v2'
import { AccidentNotificationService } from './accident-notification.service'

export interface HealthInsuranceOptions {
  clientV2Config: HealthInsuranceV2Options
}

export class HealthInsuranceModule {
  static register(options: HealthInsuranceOptions): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [HealthInsuranceV2Client.register(options.clientV2Config)],
      providers: [
        HealthInsuranceService,
        AccidentNotificationService,
        HealthInsuranceResolver,
        HealthInsuranceAccidentNotificationResolver,
      ],
      exports: [],
    }
  }
}
