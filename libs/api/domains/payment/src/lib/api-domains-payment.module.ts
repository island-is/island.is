import { DynamicModule, Module } from '@nestjs/common'
import {
  PAYMENT_OPTIONS,
  PaymentAPI,
  PaymentServiceOptions,
} from '@island.is/clients/payment'
import { PaymentResolver } from './api-domains-payment.resolver'
import { PaymentService } from './api-domains-payment.service'

@Module({})
export class PaymentModule {
  static register(config: PaymentServiceOptions): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        {
          provide: PaymentAPI,
          useFactory: () => new PaymentAPI(config),
        },
        PaymentService,
        PaymentResolver,
      ],
      exports: [
        PaymentService,
      ],
    }
  }
}
