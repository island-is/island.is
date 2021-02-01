import { DynamicModule } from '@nestjs/common'

import { ReferenceTemplateService } from './reference-template.service'

import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'

export class ReferenceTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ReferenceTemplateModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [ReferenceTemplateService],
      exports: [ReferenceTemplateService],
    }
  }
}
