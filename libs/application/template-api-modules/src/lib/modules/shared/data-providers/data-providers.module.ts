import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedDataProviderService } from './data-providers.service'
import { NationalRegistryModule } from './national-registry/national-registry.module'
// Imports of custom template API modules

export class DataProvidersModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DataProvidersModule,
      imports: [NationalRegistryModule.register(config)],
      providers: [SharedDataProviderService],
      exports: [SharedDataProviderService],
    }
  }
}
