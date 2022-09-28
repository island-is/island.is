import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { AnonymityInVehicleRegistryService } from './anonymity-in-vehicle-registry.service'

export class AnonymityInVehicleRegistryModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnonymityInVehicleRegistryModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [AnonymityInVehicleRegistryService],
      exports: [AnonymityInVehicleRegistryService],
    }
  }
}
