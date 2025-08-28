import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

import { ProblemModule } from '@island.is/nest/problem'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { XRoadConfig } from '@island.is/nest/config'

import { PaymentFlowModule } from './paymentFlow/paymentFlow.module'
import { CardPaymentModule } from './cardPayment/cardPayment.module'
import { InvoicePaymentModule } from './invoicePayment/invoicePayment.module'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { JwksModule } from './jwks/jwks.module'

@Module({
  imports: [
    ProblemModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
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
