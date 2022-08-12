import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ApplicationChargeService } from './application-charge.service'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { PaymentModule } from '../../payment/payment.module'
import { environment } from '../../../../environments'

@Module({
  imports: [
    LoggingModule,
    ChargeFjsV2ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, ChargeFjsV2ClientConfig],
    }),
    PaymentModule.register({
      clientConfig: environment.templateApi.paymentOptions,
    }),
  ],
  providers: [ApplicationChargeService],
  exports: [ApplicationChargeService],
})
export class ApplicationChargeModule {}
