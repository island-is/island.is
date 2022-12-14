import { Module } from '@nestjs/common'
import { PaymentResolver } from './api-domains-payment.resolver'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

@Module({
  imports: [
    ChargeFjsV2ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, ChargeFjsV2ClientConfig],
    }),
  ],
  providers: [PaymentResolver],
})
export class ApiDomainsPaymentModule {}
