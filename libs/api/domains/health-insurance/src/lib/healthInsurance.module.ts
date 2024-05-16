import { DynamicModule } from '@nestjs/common'
import {
  HealthInsuranceAccidentNotificationResolver,
  HealthInsuranceResolver,
} from './graphql'
import { HealthInsuranceService } from './healthInsurance.service'
import { HealthInsuranceV2ClientModule } from '@island.is/clients/icelandic-health-insurance/health-insurance'
import { AccidentNotificationService } from './accident-notification.service'

export class HealthInsuranceModule {
  static register(): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [HealthInsuranceV2ClientModule],
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
