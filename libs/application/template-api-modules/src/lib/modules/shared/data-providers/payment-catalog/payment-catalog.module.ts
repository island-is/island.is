import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { PaymentCatalogService } from './payment-catalog.service'
import { PaymentAPI } from '@island.is/clients/payment'

// Imports of custom template API modules

export class PaymentCatalogModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PaymentCatalogModule,
      imports: [],
      providers: [
        {
          provide: PaymentAPI,
          useFactory: () => new PaymentAPI(config.paymentOptions),
        },
        PaymentCatalogService,
      ],
      exports: [PaymentCatalogService],
    }
  }
}
