import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { PartyLetterService } from './party-letter.service'

export class PartyLetterModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PartyLetterModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [PartyLetterService],
      exports: [PartyLetterService],
    }
  }
}
