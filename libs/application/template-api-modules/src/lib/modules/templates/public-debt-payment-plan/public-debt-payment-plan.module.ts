import { DynamicModule } from '@nestjs/common'

import { PaymentScheduleClientModule } from '@island.is/clients/payment-schedule'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'
// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// Here you import your module service
import { PublicDebtPaymentPlanTemplateService } from './public-debt-payment-plan.service'

export class PublicDebtPaymentPlanTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PublicDebtPaymentPlanTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        PaymentScheduleClientModule.register(config.paymentScheduleConfig),
      ],
      providers: [PublicDebtPaymentPlanTemplateService],
      exports: [PublicDebtPaymentPlanTemplateService],
    }
  }
}
