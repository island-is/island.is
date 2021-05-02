import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
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
