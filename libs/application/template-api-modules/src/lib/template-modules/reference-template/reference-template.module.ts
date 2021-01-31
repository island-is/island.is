import { DynamicModule } from '@nestjs/common'

import { ReferenceTemplateService } from './reference-template.service'

import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../types'

interface ReferenceTemplateApiModuleConfig
  extends BaseTemplateAPIModuleConfig {}

export class ReferenceTemplateModule {
  static register(config: ReferenceTemplateApiModuleConfig): DynamicModule {
    return {
      module: ReferenceTemplateModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [ReferenceTemplateService],
      exports: [ReferenceTemplateService],
    }
  }
}
