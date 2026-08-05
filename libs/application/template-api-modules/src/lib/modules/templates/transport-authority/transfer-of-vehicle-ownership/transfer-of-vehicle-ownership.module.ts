import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { TransferOfVehicleOwnershipService } from './transfer-of-vehicle-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  VehicleServiceFjsV1ClientModule,
  VehicleServiceFjsV1ClientConfig,
} from '@island.is/clients/vehicle-service-fjs-v1'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import {
  VehiclesMileageClientConfig,
  VehiclesMileageClientModule,
} from '@island.is/clients/vehicles-mileage'
import { PaymentModule } from '@island.is/application/api/payment'
@Module({
  imports: [
    SharedTemplateAPIModule,
    VehicleOwnerChangeClientModule,
    VehicleCodetablesClientModule,
    VehicleServiceFjsV1ClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    PaymentModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOwnerChangeClientConfig,
        VehicleCodetablesClientConfig,
        VehicleServiceFjsV1ClientConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
      ],
    }),
  ],
  providers: [TransferOfVehicleOwnershipService],
  exports: [TransferOfVehicleOwnershipService],
})
export class TransferOfVehicleOwnershipModule {}
