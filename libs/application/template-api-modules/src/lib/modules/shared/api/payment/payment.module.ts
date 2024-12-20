import { Module } from '@nestjs/common'

import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { PaymentModule } from '@island.is/application/api/payment'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    ChargeFjsV2ClientModule,
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
