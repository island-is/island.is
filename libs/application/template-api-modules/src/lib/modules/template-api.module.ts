import { DynamicModule } from '@nestjs/common'

// Imports of custom template API modules
import { modules } from './templates'

import { BaseTemplateAPIModuleConfig } from '../types'

import { TemplateAPIService } from './template-api.service'
import { ConfigModule } from '@island.is/nest/config'
import {
  SyslumennClientModule,
  SyslumennClientConfig,
} from '@island.is/clients/syslumenn'

export class TemplateAPIModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: TemplateAPIModule,
      imports: [
        SyslumennClientModule,
        ...Object.values(modules).map((Module) => Module.register(config)),
        ConfigModule.forRoot({
          isGlobal: true,
          load: [SyslumennClientConfig],
        }),
      ],
      providers: [TemplateAPIService],
      exports: [TemplateAPIService],
    }
  }
}
