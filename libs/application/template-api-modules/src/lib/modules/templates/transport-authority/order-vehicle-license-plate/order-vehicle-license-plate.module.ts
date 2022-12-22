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
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'

export class OrderVehicleLicensePlateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleLicensePlateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehiclePlateOrderingClientModule,
        VehicleCodetablesClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            VehiclePlateOrderingClientConfig,
            VehicleCodetablesClientConfig,
          ],
        }),
      ],
      providers: [OrderVehicleLicensePlateService],
      exports: [OrderVehicleLicensePlateService],
    }
  }
}
