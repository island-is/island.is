import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { PaymentCatalogService } from './payment-catalog.service'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

export class PaymentCatalogModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PaymentCatalogModule,
      imports: [
        ChargeFjsV2ClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [XRoadConfig, ChargeFjsV2ClientConfig],
        }),
      ],
      providers: [PaymentCatalogService],
      exports: [PaymentCatalogService],
    }
  }
}
