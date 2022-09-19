import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryService } from './national-registry.service'

export class NationalRegistryModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: NationalRegistryModule,
      imports: [NationalRegistryClientModule],
      providers: [NationalRegistryService],
      exports: [NationalRegistryService],
    }
  }
}
