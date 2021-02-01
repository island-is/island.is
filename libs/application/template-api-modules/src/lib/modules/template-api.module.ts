import { DynamicModule } from '@nestjs/common'
import { ParentalLeaveModule, ReferenceTemplateModule } from './templates'

import { BaseTemplateAPIModuleConfig } from '../types'

import { TemplateAPIService } from './template-api.service'

const templateModulesToLoad = [ReferenceTemplateModule, ParentalLeaveModule]

export class TemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TemplateAPIModule,
      imports: [
        ...templateModulesToLoad.map((Module) => Module.register(config)),
      ],
      providers: [TemplateAPIService],
      exports: [TemplateAPIService],
    }
  }
}
