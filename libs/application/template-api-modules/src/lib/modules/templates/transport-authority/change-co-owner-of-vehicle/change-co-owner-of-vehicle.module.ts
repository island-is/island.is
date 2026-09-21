import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
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
    VehicleOwnerChangeClientModule,
    VehicleOperatorsClientModule,
    VehicleCodetablesClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOwnerChangeClientConfig,
        VehicleOperatorsClientConfig,
        VehicleCodetablesClientConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
      ],
    }),
  ],
  providers: [ChangeCoOwnerOfVehicleService],
  exports: [ChangeCoOwnerOfVehicleService],
})
export class ChangeCoOwnerOfVehicleModule {}
