import { DynamicModule, Module } from '@nestjs/common'
import {
  PAYMENT_OPTIONS,
  PaymentAPI,
  PaymentServiceOptions,
} from '@island.is/clients/payment'
import { PaymentResolver } from './api-domains-payment.resolver'
import { ApiDomainsPaymentService } from './api-domains-payment.service'

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
        ApiDomainsPaymentService,
        PaymentResolver,
      ],
      exports: [ApiDomainsPaymentService],
    }
  }
}
