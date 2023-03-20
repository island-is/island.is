import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { AnonymityInVehicleRegistryService } from './anonymity-in-vehicle-registry.service'
import {
  VehicleInfolocksClientModule,
  VehicleInfolocksClientConfig,
} from '@island.is/clients/transport-authority/vehicle-infolocks'

export class AnonymityInVehicleRegistryModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: AnonymityInVehicleRegistryModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleInfolocksClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehicleInfolocksClientConfig],
        }),
      ],
      providers: [AnonymityInVehicleRegistryService],
      exports: [AnonymityInVehicleRegistryService],
    }
  }
}
