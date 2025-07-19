import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'

import { ProblemModule } from '@island.is/nest/problem'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { XRoadConfig } from '@island.is/nest/config'

import { PaymentFlowModule } from './paymentFlow/paymentFlow.module'
import { CardPaymentModule } from './cardPayment/cardPayment.module'
import { InvoicePaymentModule } from './invoicePayment/invoicePayment.module'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { JwksModule } from './jwks/jwks.module'
import { environment } from '../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
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
      load: [
        XRoadConfig,
        FeatureFlagConfig,
        ChargeFjsV2ClientConfig,
        NationalRegistryV3ClientConfig,
        CompanyRegistryConfig,
      ],
    }),
  ],
})
export class AppModule {}
