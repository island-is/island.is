import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { PaymentFlowModule } from '../paymentFlow/paymentFlow.module'
import { BankTransferPayment } from './models/bankTransferPayment.model'

/**
 * Module for the instant bank-transfer payment method (Blikk as the v1 provider).
 *
 * Depends one-way on PaymentFlowModule: it uses PaymentFlowService (status, FJS charge,
 * confirmation, upstream notifications) and receives the BankTransferPayment repository via
 * the SequelizeModule that PaymentFlowModule exports. PaymentFlowModule must not import this
 * module (would be circular) — which is why the BankTransferPayment model is registered in
 * paymentFlow.module.ts even though it lives in this module's directory.
 *
 * The service, controller and Blikk provider adapter are added in later steps; until then this
 * module has nothing to register in app.module.ts.
 */
@Module({
  imports: [
    SequelizeModule.forFeature([BankTransferPayment]),
    PaymentFlowModule,
  ],
})
export class BankTransferPaymentModule {}
