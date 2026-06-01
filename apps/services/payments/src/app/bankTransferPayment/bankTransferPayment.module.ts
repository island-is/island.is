import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { PaymentFlowModule } from '../paymentFlow/paymentFlow.module'
import { BankTransferModuleConfig } from './bankTransfer.config'
import { BankTransferController } from './bankTransfer.controller'
import { BankTransferService } from './bankTransfer.service'
import { BankTransferPayment } from './models/bankTransferPayment.model'

/** Bank-transfer module (Blikk v1). Uses forwardRef both ways to resolve the cycle with PaymentFlowModule. */
@Module({
  imports: [
    SequelizeModule.forFeature([BankTransferPayment]),
    ConfigModule.forRoot({ load: [BankTransferModuleConfig] }),
    FeatureFlagModule,
    forwardRef(() => PaymentFlowModule),
  ],
  controllers: [BankTransferController],
  providers: [BankTransferService],
  exports: [BankTransferService],
})
export class BankTransferPaymentModule {}
