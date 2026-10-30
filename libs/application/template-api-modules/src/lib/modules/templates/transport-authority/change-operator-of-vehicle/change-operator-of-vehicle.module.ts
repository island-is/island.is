import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { ChangeOperatorOfVehicleService } from './change-operator-of-vehicle.service'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import {
  VehiclesMileageClientModule,
  VehiclesMileageClientConfig,
} from '@island.is/clients/vehicles-mileage'
import { PaymentModule } from '@island.is/application/api/payment'
@Module({
  imports: [
    SharedTemplateAPIModule,
    VehicleOperatorsClientModule,
    VehicleOwnerChangeClientModule,
    VehicleCodetablesClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOperatorsClientConfig,
        VehicleOwnerChangeClientConfig,
        VehicleCodetablesClientConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
      ],
    }),
  ],
  providers: [ChangeOperatorOfVehicleService],
  exports: [ChangeOperatorOfVehicleService],
})
export class ChangeOperatorOfVehicleModule {}
