import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { PAYMENT_OPTIONS,PaymentAPI } from '@island.is/clients/payment'
import { PaymentServiceOptions } from '@island.is/clients/payment'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../../../environments'
import { Application } from '../application/application.model'

import { PaymentController } from './payment.controller'
import { Payment } from './payment.model'
import { PaymentService } from './payment.service'
import { PaymentCallbackController } from './payment-callback.controller'

export interface Config {
  clientConfig: PaymentServiceOptions
}

@Module({})
export class PaymentModule {
  static register(config: Config): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        PaymentService,
        {
          provide: PAYMENT_OPTIONS,
          useValue: config.clientConfig,
        },
        {
          provide: PaymentAPI,
          useFactory: () => {
            return new PaymentAPI(config.clientConfig)
          },
        },
      ],
      imports: [
        AuditModule.forRoot(environment.audit),
        SequelizeModule.forFeature([Payment]),
        SequelizeModule.forFeature([Application]),
        CmsTranslationsModule,
      ],
      controllers: [PaymentController, PaymentCallbackController],
      exports: [PaymentService],
    }
  }
}
