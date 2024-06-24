import { DynamicModule } from '@nestjs/common'
import { IdCardService } from './id-card.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { PassportsClientModule } from '@island.is/clients/passports'
import { ConfigModule } from '@nestjs/config'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'

export class IdCardModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: IdCardModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ChargeFjsV2ClientModule,
        PassportsClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [ChargeFjsV2ClientConfig],
        }),
      ],
      providers: [IdCardService],
      exports: [IdCardService],
    }
  }
}
