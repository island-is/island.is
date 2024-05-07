import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { NationalRegistryEESService } from './national-registry-ees.service'
import { BaseTemplateAPIModuleConfig } from '../../../types'


export class NationalRegistyEESModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NationalRegistyEESModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [NationalRegistryEESService],
      exports: [NationalRegistryEESService],
    }
  }
}
