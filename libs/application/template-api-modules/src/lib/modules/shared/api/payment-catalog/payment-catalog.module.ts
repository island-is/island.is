import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { PaymentCatalogService } from './payment-catalog.service'
import { PaymentClientModule } from '@island.is/clients/payment'

export class PaymentCatalogModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PaymentCatalogModule,
      imports: [PaymentClientModule],
      providers: [PaymentCatalogService],
      exports: [PaymentCatalogService],
    }
  }
}
