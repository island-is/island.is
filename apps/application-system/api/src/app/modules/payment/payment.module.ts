import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { TranslationsModule } from '@island.is/api/domains/translations'
import { AuditModule } from '@island.is/nest/audit'

import { Payment } from './payment.model'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'
import { environment } from '../../../environments'
import {
  PAYMENT_CONFIG,
  PaymentServiceOptions,
  PaymentConfig,
} from './payment.configuration'
import { PaymentAPI } from '@island.is/clients/payment'

export interface Config {
  xroadBaseUrl: string
  xroadClientId: string
  secret: string
}

@Module({})
export class PaymentModule {
  static register(config?: PaymentServiceOptions): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        PaymentService,
        {
          provide: PAYMENT_CONFIG,
          useValue: environment.templateApi.paymentOptions as PaymentConfig,
        },
        {
          provide: PaymentAPI,
          useFactory: () => {
            return new PaymentAPI(environment.templateApi.paymentOptions as PaymentServiceOptions)
          }
        },
      ],
      imports: [
        AuditModule.forRoot(environment.audit),
        SequelizeModule.forFeature([Payment]),
        TranslationsModule,
      ],
      controllers: [PaymentController],
      exports: [PaymentService],
    }
  }
}
