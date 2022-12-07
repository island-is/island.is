import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ChangeCoOwnerOfVehicleService } from './change-co-owner-of-vehicle.service'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'

export class ChangeCoOwnerOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeCoOwnerOfVehicleModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleOwnerChangeClientModule,
        VehicleOperatorsClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehicleOwnerChangeClientConfig, VehicleOperatorsClientConfig],
        }),
      ],
      providers: [ChangeCoOwnerOfVehicleService],
      exports: [ChangeCoOwnerOfVehicleService],
    }
  }
}
