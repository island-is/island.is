import { Module } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// Here you import your module service
import { PublicDebtPaymentPlanTemplateService } from './public-debt-payment-plan.service'

import { PaymentScheduleClientModule } from '@island.is/clients/payment-schedule'
import { PrerequisitesService } from './paymentPlanPrerequisites.service'

@Module({
  imports: [SharedTemplateAPIModule, PaymentScheduleClientModule],
  providers: [PublicDebtPaymentPlanTemplateService, PrerequisitesService],
  exports: [PublicDebtPaymentPlanTemplateService],
})
export class PublicDebtPaymentPlanTemplateModule {}
