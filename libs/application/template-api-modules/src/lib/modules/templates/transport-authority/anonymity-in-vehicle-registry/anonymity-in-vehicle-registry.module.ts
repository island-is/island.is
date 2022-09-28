import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'

export class AnonymityInVehicleRegistryModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnonymityInVehicleRegistryModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [],
      exports: [],
    }
  }
}
