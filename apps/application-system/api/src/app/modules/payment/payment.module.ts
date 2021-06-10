import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
import { createRedisCluster } from '@island.is/cache'
import { TemplateAPIModule } from '@island.is/application/template-api-modules'
import { AuthModule } from '@island.is/auth-nest-tools'
import { TranslationsModule } from '@island.is/api/domains/translations'
import { SigningModule } from '@island.is/dokobit-signing'
import { AuditModule } from '@island.is/nest/audit'
import { ApiDomainsPaymentModule } from '@island.is/api/domains/payment'

import { Payment } from './payment.model'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { AwsService } from '../application/files/aws.service'
import { environment } from '../../../environments'
import {
  PAYMENT_CONFIG,
  PaymentConfig,
  PaymentServiceOptions,
} from './payment.configuration'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
}

export class PaymentModule {
  static register(config?: PaymentServiceOptions): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        PaymentService,
        {
          provide: PAYMENT_CONFIG,
          useValue: environment.application as PaymentConfig,
        },
        AwsService,
        // {
        //   provide: DrivingLicenseApi,
        //   useFactory: async () =>
        //     new DrivingLicenseApi(
        //       config.xroadBaseUrl,
        //       config.xroadClientId,
        //       config.secret,
        //     ),
        // },
      ],
      imports: [
        AuditModule.forRoot(environment.audit),
        SequelizeModule.forFeature([Payment]),
        ApiDomainsPaymentModule.register(config as PaymentServiceOptions),
        TranslationsModule,
      ],
      controllers: [PaymentController],
      exports: [PaymentService],
    }
  }
}