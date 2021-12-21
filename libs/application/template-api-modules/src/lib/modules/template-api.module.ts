import { DynamicModule } from '@nestjs/common'

// Imports of custom template API modules
import { modules, clientModules, clientConfigs } from './templates'

import { BaseTemplateAPIModuleConfig } from '../types'

import { TemplateAPIService } from './template-api.service'
import { ConfigModule } from '@island.is/nest/config'

export class TemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TemplateAPIModule,
      imports: [
        ...Object.values(clientModules).map((Module) => Module),
        ...Object.values(modules).map((Module) => Module.register(config)),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [...Object.values(clientConfigs).map((Config) => Config)],
        }),
      ],
      providers: [TemplateAPIService],
      exports: [TemplateAPIService],
    }
  }
}
