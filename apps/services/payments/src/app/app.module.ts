import { LoggingModule } from '@island.is/logging'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { XRoadConfig } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { SequelizeConfigService } from '../sequelizeConfig.service'
import { CardPaymentModule } from './cardPayment/cardPayment.module'
import { InvoicePaymentModule } from './invoicePayment/invoicePayment.module'
import { JwksModule } from './jwks/jwks.module'
import { PaymentFlowModule } from './paymentFlow/paymentFlow.module'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ProblemModule,
    LoggingModule,
    PaymentFlowModule,
    CardPaymentModule,
    InvoicePaymentModule,
    JwksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, FeatureFlagConfig, ChargeFjsV2ClientConfig],
    }),
  ],
})
export class AppModule {}
