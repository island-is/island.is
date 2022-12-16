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
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import { AuthModule } from '@island.is/auth-nest-tools'

export class ChangeCoOwnerOfVehicleModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ChangeCoOwnerOfVehicleModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehicleOwnerChangeClientModule,
        VehicleOperatorsClientModule,
        VehiclesClientModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            VehicleOwnerChangeClientConfig,
            VehicleOperatorsClientConfig,
            VehiclesClientConfig,
          ],
        }),
      ],
      providers: [ChangeCoOwnerOfVehicleService],
      exports: [ChangeCoOwnerOfVehicleService],
    }
  }
}
