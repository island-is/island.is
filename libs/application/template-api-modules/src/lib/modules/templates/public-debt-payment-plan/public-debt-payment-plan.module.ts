import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { FileStorageModule } from '@island.is/file-storage'
import { PUBLIC_DEBT_PAYMENT_PLAN_CONFIG } from './config/publicDebtPaymentPlanConfig'
import { PublicDebtPaymentPlanService } from './public-debt-payment-plan.service'

const applicationSenderName = process.env.EMAIL_FROM_NAME ?? ''

const applicationSenderEmail = process.env.EMAIL_FROM ?? 'development@island.is'

export class PublicDebtPaymentPlanModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PublicDebtPaymentPlanModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FileStorageModule.register({}),
      ],
      providers: [
        {
          provide: PUBLIC_DEBT_PAYMENT_PLAN_CONFIG,
          useValue: {
            applicationSenderName,
            applicationSenderEmail,
          },
        },
        PublicDebtPaymentPlanService,
      ],
      exports: [PublicDebtPaymentPlanService],
    }
  }
}
