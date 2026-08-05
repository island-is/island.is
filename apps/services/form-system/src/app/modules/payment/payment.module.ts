import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import {
  ClientsPaymentsModule,
  PaymentsApiClientConfig,
} from '@island.is/clients/payments'
import { LoggingModule } from '@island.is/logging'
import { XRoadConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsModule } from '../applications/applications.module'
import { PaymentCallbackController } from './payment-callback.controller'
import { PaymentModuleConfig } from './payment.config'
import { PaymentController } from './payment.controller'
import { Payment } from './payment.model'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Payment]),
    ApplicationsModule,
    LoggingModule,
    ChargeFjsV2ClientModule,
    ClientsPaymentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        ChargeFjsV2ClientConfig,
        PaymentsApiClientConfig,
        PaymentModuleConfig,
      ],
    }),
  ],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController, PaymentCallbackController],
})
export class PaymentModule {}
