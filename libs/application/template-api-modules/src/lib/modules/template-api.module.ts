import { DynamicModule } from '@nestjs/common'
// Imports of custom template API modules
import { modules, services, dynamicModules } from './templates'
import {
  modules as sharedModules,
  services as sharedServices,
  dynamicModules as sharedDynamicModules,
} from './shared/api'
import { BaseTemplateAPIModuleConfig } from '../types'
import { TemplateAPIService } from './template-api.service'
import { TEMPLATE_API_SERVICES } from './template-api.constants'
import { LoggingModule } from '@island.is/logging'

export class TemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TemplateAPIModule,
      imports: [
        ...Object.values([...dynamicModules, ...sharedDynamicModules]).map(
          (Module) => Module.register(config),
        ),
        ...sharedModules,
        ...modules,
        LoggingModule,
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
