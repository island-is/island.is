import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ApplicationChargeService } from './application-charge.service'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { PaymentModule } from '@island.is/application/api/payment'

@Module({
  imports: [
    LoggingModule,
    ChargeFjsV2ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, ChargeFjsV2ClientConfig],
    }),
    PaymentModule,
  ],
  providers: [ApplicationChargeService],
  exports: [ApplicationChargeService],
})
export class ApplicationChargeModule {}
