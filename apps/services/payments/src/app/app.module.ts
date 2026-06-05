import { LoggingModule } from '@island.is/logging'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { BlikkClientConfig } from '@island.is/clients/blikk'
import { XRoadConfig } from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { SequelizeConfigService } from '../sequelizeConfig.service'
import { BankTransferPaymentModule } from './bankTransferPayment/bankTransferPayment.module'
import { CardPaymentModule } from './cardPayment/cardPayment.module'
import { InvoicePaymentModule } from './invoicePayment/invoicePayment.module'
import { JwksModule } from './jwks/jwks.module'
import { PaymentFlowModule } from './paymentFlow/paymentFlow.module'
import { RefundModule } from './refund/refund.module'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ProblemModule,
    LoggingModule,
    PaymentFlowModule,
    RefundModule,
    CardPaymentModule,
    InvoicePaymentModule,
    BankTransferPaymentModule,
    JwksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        FeatureFlagConfig,
        ChargeFjsV2ClientConfig,
        BlikkClientConfig,
      ],
    }),
  ],
})
export class AppModule {}
