import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import { DynamicModule } from '@nestjs/common'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../..'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../../types'

// Here you import your module service
import { NationalRegistryService } from './national-registry.service'

export class NationalRegistryModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NationalRegistryModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        NationalRegistryService,
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            NationalRegistryApi.instantiateClass(config.nationalRegistry),
        },
      ],
      exports: [NationalRegistryService],
    }
  }
}
