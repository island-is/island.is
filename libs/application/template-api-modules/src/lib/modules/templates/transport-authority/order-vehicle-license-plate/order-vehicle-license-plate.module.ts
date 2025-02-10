import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { OrderVehicleLicensePlateService } from './order-vehicle-license-plate.service'
import {
  VehiclePlateOrderingClientModule,
  VehiclePlateOrderingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'

@Module({
  imports: [
    SharedTemplateAPIModule,
    VehiclePlateOrderingClientModule,
    VehicleCodetablesClientModule,
    VehiclesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehiclePlateOrderingClientConfig,
        VehicleCodetablesClientConfig,
        VehiclesClientConfig,
      ],
    }),
  ],
  providers: [OrderVehicleLicensePlateService],
  exports: [OrderVehicleLicensePlateService],
})
export class OrderVehicleLicensePlateModule {}
