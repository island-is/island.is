import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { PartyApplicationService } from './party-application.service'

export class PartyApplicationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PartyApplicationModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [PartyApplicationService],
      exports: [PartyApplicationService],
    }
  }
}
