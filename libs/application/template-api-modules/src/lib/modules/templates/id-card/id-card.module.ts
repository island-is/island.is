import { DynamicModule } from '@nestjs/common'
import { IdCardService } from './id-card.service'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { PassportsClientModule } from '@island.is/clients/passports'

export class IdCardModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: IdCardModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        PassportsClientModule,
      ],
      providers: [IdCardService],
      exports: [IdCardService],
    }
  }
}
