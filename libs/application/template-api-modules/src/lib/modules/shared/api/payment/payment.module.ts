import { Module } from '@nestjs/common'

import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { PaymentModule } from '@island.is/application/api/payment'
import { PaymentService } from './payment.service'
import { ClientsPaymentsModule } from '@island.is/clients/payments'

@Module({
  imports: [
    ChargeFjsV2ClientModule,
    ClientsPaymentsModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, ChargeFjsV2ClientConfig],
    }),
  ],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentApiModule {}
