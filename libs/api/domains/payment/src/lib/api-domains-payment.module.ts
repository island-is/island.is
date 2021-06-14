import { DynamicModule, Module } from '@nestjs/common'
import { PaymentAPI } from '@island.is/clients/payment'
import { PaymentResolver } from './api-domains-payment.resolver'
import { ApiDomainsPaymentService } from './api-domains-payment.service'
import { PaymentServiceOptions } from './api-domains-payment.types'

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
