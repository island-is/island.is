import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { AnonymityInVehicleRegistryService } from './anonymity-in-vehicle-registry.service'
import { AnonymityInVehicleRegistryApiModule } from '@island.is/api/domains/transport-authority/anonymity-in-vehicle-registry'

export class AnonymityInVehicleRegistryModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnonymityInVehicleRegistryModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        AnonymityInVehicleRegistryApiModule,
      ],
      providers: [AnonymityInVehicleRegistryService],
      exports: [AnonymityInVehicleRegistryService],
    }
  }
}
