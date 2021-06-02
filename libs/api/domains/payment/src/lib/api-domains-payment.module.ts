import { DynamicModule, Module } from '@nestjs/common'
import {
  PAYMENT_OPTIONS,
  PaymentAPI,
  PaymentServiceOptions,
} from '@island.is/clients/payment'
import { PaymentResolver } from './api-domains-payment.resolver'

@Module({})
export class PaymentModule {
  static register(config: PaymentServiceOptions): DynamicModule {
    return {
      module: PaymentModule,
      providers: [
        PaymentAPI,
        PaymentResolver,
        {
          provide: PAYMENT_OPTIONS,
          useValue: config,
        },
      ],
    }
  }
}
