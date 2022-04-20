import { DynamicModule } from '@nestjs/common'
// Imports of custom template API modules
import { modules } from './templates'
import { BaseTemplateAPIModuleConfig } from '../types'
import { TemplateAPIService } from './template-api.service'
import { NationalRegistryModule } from './dataproviders/national-registry/national-registry.module'

export class TemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TemplateAPIModule,
      imports: [
        ...Object.values(modules).map((Module) => Module.register(config)),
        NationalRegistryModule.register(config),
      ],
      providers: [TemplateAPIService],
      exports: [TemplateAPIService],
    }
  }
}
