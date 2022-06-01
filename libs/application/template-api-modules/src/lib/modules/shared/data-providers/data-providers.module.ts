import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedDataProviderService } from './data-providers.service'
import { NationalRegistryModule } from './national-registry/national-registry.module'
import { UserProfileModule } from './user-profile/user-profile.module'
// Imports of custom template API modules

export class DataProvidersModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DataProvidersModule,
      imports: [
        NationalRegistryModule.register(config),
        UserProfileModule.register(config),
      ],
      providers: [SharedDataProviderService],
      exports: [SharedDataProviderService],
    }
  }
}
