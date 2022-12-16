import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleLicensePlateService } from './order-vehicle-license-plate.service'
import {
  VehiclePlateOrderingClientModule,
  VehiclePlateOrderingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import { AuthModule } from '@island.is/auth-nest-tools'

export class OrderVehicleLicensePlateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleLicensePlateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehiclePlateOrderingClientModule,
        VehiclesClientModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehiclePlateOrderingClientConfig, VehiclesClientConfig],
        }),
      ],
      providers: [OrderVehicleLicensePlateService],
      exports: [OrderVehicleLicensePlateService],
    }
  }
}
