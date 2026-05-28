import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { PaymentFlowModule } from '../paymentFlow/paymentFlow.module'
import { BankTransferModuleConfig } from './bankTransfer.config'
import { BankTransferController } from './bankTransfer.controller'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferPayment } from './models/bankTransferPayment.model'

/**
 * Module for the instant bank-transfer payment method (Blikk as the v1 provider).
 *
 * Depends one-way on PaymentFlowModule: it uses PaymentFlowService (status, FJS charge, confirmation,
 * upstream notifications). PaymentFlowModule must not import this module (would be circular).
 */
@Module({
  imports: [
    SequelizeModule.forFeature([BankTransferPayment]),
    ConfigModule.forRoot({ load: [BankTransferModuleConfig] }),
    PaymentFlowModule,
  ],
  controllers: [BankTransferController],
  providers: [BankTransferService],
})
export class BankTransferPaymentModule {}
