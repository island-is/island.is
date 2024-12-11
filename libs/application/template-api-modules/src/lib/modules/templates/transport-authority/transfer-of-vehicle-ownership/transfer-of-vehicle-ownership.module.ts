import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { TransferOfVehicleOwnershipService } from './transfer-of-vehicle-ownership.service'
import { ConfigModule } from '@nestjs/config'
import {
  ChargeFjsV2ClientConfig,
  ChargeFjsV2ClientModule,
} from '@island.is/clients/charge-fjs-v2'
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

@Module({
  imports: [
    SharedTemplateAPIModule,
    ChargeFjsV2ClientModule,
    VehicleOwnerChangeClientModule,
    VehicleCodetablesClientModule,
    VehicleServiceFjsV1ClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        ChargeFjsV2ClientConfig,
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
