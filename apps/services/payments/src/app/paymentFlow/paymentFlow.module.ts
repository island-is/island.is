import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { PaymentFlowController } from './paymentFlow.controller'
import { DebtPaymentFlowController } from './debtPaymentFlow.controller'
import { PaymentFlowService } from './paymentFlow.service'
import {
  PaymentFlow,
  PaymentFlowCharge,
  PaymentFlowEvent,
  FjsCharge,
  CardPaymentDetails,
  PaymentFulfillment,
  PaymentWorkerEvent,
  PaymentFlowDebt,
  FjsDebtPayment,
} from './models'
import { JwksModule } from '../jwks/jwks.module'
import { ConfigModule } from '@nestjs/config'
import { PaymentFlowModuleConfig } from './paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'
import { BankTransferPaymentModule } from '../bankTransferPayment/bankTransferPayment.module'
import { DebtPaymentModule } from '../debtPayment/debtPayment.module'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentFlow,
      PaymentFlowCharge,
      PaymentFlowEvent,
      FjsCharge,
      CardPaymentDetails,
      PaymentFulfillment,
      PaymentWorkerEvent,
      PaymentFlowDebt,
      FjsDebtPayment,
    ]),
    ConfigModule.forRoot({
      load: [PaymentFlowModuleConfig, JwksConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    DebtPaymentModule,
    JwksModule,
    forwardRef(() => BankTransferPaymentModule),
  ],
  controllers: [PaymentFlowController, DebtPaymentFlowController],
  providers: [PaymentFlowService],
  exports: [PaymentFlowService, SequelizeModule],
})
export class PaymentFlowModule {}
