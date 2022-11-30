import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehiclePlateOrderingClientModule,
  VehiclePlateOrderingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { MainResolver } from './graphql/main.resolver'
import { OrderVehicleLicensePlateApi } from './orderVehicleLicensePlate.service'

@Module({
  imports: [
    VehiclePlateOrderingClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclePlateOrderingClientConfig],
    }),
  ],
  providers: [MainResolver, OrderVehicleLicensePlateApi],
  exports: [OrderVehicleLicensePlateApi],
})
export class OrderVehicleLicensePlateApiModule {}
