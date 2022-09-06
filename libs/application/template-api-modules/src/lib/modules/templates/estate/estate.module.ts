import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { EstateService } from './estate.service'

export class EstateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EstateModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [EstateService],
      exports: [EstateService],
    }
  }
}
