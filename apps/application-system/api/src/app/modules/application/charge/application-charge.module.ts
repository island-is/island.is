import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { ApplicationChargeService } from './application-charge.service'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import {
  PaymentModule,
  PaymentModuleConfig,
} from '@island.is/application/api/payment'
import { ClientsPaymentsModule } from '@island.is/clients/payments'

@Module({
  imports: [
    LoggingModule,
    ClientsPaymentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, PaymentModuleConfig],
    }),
    PaymentModule,
  ],
  providers: [ApplicationChargeService],
  exports: [ApplicationChargeService],
})
export class ApplicationChargeModule {}
