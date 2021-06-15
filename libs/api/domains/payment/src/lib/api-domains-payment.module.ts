import { DynamicModule, Module } from '@nestjs/common'
import { PaymentAPI, PAYMENT_OPTIONS } from '@island.is/clients/payment'
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
        {
          provide: ApiDomainsPaymentService,
          useFactory: () => new ApiDomainsPaymentService(new PaymentAPI(config), config)
        },
        PaymentResolver,
      ],
      exports: [ApiDomainsPaymentService],
    }
  }
}
