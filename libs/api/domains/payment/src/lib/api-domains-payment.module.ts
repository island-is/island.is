import { DynamicModule, Module } from '@nestjs/common'
import { PAYMENT_OPTIONS, PaymentService, PaymentServiceOptions } from '@island.is/clients/payment'
import { PaymentResolver } from './api-domains-payment.resolver'

@Module({})
export class PaymentModule {
  static register(config: PaymentServiceOptions): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        PaymentResolver,
        {
          provide: PAYMENT_OPTIONS,
          useValue: config,
        },
        PaymentService,
      ],
    }
  }
}
