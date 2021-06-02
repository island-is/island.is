import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmailModule } from '@island.is/email-service'
import { PaymentModule } from '@island.is/api/domains/payment'

import { BaseTemplateAPIModuleConfig } from '../../types'
import { SharedTemplateApiService } from './shared.service'

export class SharedTemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    const configuration = () => config

    return {
      module: SharedTemplateAPIModule,
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
        EmailModule.register(config.emailOptions),
        PaymentModule.register(config.paymentOptions),
      ],
      providers: [SharedTemplateApiService],
      exports: [SharedTemplateApiService],
    }
  }
}
