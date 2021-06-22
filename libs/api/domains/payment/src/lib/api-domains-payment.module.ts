import { DynamicModule, Module } from '@nestjs/common'
import { PaymentAPI, PaymentServiceOptions } from '@island.is/clients/payment'
import { PaymentResolver } from './api-domains-payment.resolver'

@Module({})
export class ApiDomainsPaymentModule {
  static register(config: PaymentServiceOptions): DynamicModule {
    return {
      module: ApiDomainsPaymentModule,
      providers: [
        {
          provide: PaymentAPI,
          useFactory: () => new PaymentAPI(config),
        },
        PaymentResolver,
      ],
    }
  }
}
