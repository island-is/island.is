import {
  ApplicationApiCoreModule,
  SequelizeConfigService,
} from '@island.is/application/api/core'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { PaymentService } from './payment.service'
import {
  PaymentClientModule,
  PaymentClientModuleConfig,
} from '@island.is/clients/payment'
import { PaymentController } from './payment.controller'
import { PaymentCallbackController } from './payment-callback.controller'
import { LoggingModule } from '@island.is/logging'
import { ConfigModule } from '@nestjs/config'
import { PaymentModuleConfig } from './payment.config'
import { AuditModule } from '@island.is/nest/audit'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Payment]),
    PaymentClientModule,
    ApplicationApiCoreModule,
    LoggingModule,
  ],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController, PaymentCallbackController],
})
export class PaymentModule {}
