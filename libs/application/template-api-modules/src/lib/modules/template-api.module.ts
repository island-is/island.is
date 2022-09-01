import { DynamicModule } from '@nestjs/common'
// Imports of custom template API modules
import { modules, services } from './templates'
import {
  modules as sharedModules,
  services as sharedServices,
} from './shared/data-providers'
import { BaseTemplateAPIModuleConfig } from '../types'
import { TemplateAPIService } from './template-api.service'
import { TEMPLATE_API_SERVICES } from './template-api.constants'

export class TemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TemplateAPIModule,
      imports: [
        ...Object.values([...modules, ...sharedModules]).map((Module) =>
          Module.register(config),
        ),
      ],
      providers: [
        TemplateAPIService,
        {
          provide: TEMPLATE_API_SERVICES,
          useFactory: (...args) => [...args],
          inject: [...services, ...sharedServices],
        },
      ],
      exports: [TemplateAPIService],
    }
  }
}
