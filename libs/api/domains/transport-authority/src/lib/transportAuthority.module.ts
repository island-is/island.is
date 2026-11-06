import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { TransportAuthorityApi } from './transportAuthority.service'
import {
  VehicleOwnerChangeClientModule,
  VehicleOwnerChangeClientConfig,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import {
  VehicleOperatorsClientModule,
  VehicleOperatorsClientConfig,
} from '@island.is/clients/transport-authority/vehicle-operators'
import {
  VehiclePlateOrderingClientModule,
  VehiclePlateOrderingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import {
  VehiclePlateRenewalClientModule,
  VehiclePlateRenewalClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-renewal'
import {
  ExemptionForTransportationClientConfig,
  ExemptionForTransportationClientModule,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import {
  TaxiClientConfig,
  TaxiClientModule,
} from '@island.is/clients/transport-authority/taxi'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import {
  VehiclesMileageClientConfig,
  VehiclesMileageClientModule,
} from '@island.is/clients/vehicles-mileage'
import { TaxiStationsResolver } from './graphql/resolvers/taxiStations.resolver'
import { TaxiDriversResolver } from './graphql/resolvers/taxiDrivers.resolver'

@Module({
  imports: [
    VehicleOwnerChangeClientModule,
    DigitalTachographDriversCardClientModule,
    VehicleOperatorsClientModule,
    VehiclePlateOrderingClientModule,
    VehiclePlateRenewalClientModule,
    ExemptionForTransportationClientModule,
    TaxiClientModule,
    VehiclesClientModule,
    VehiclesMileageClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleOwnerChangeClientConfig,
        DigitalTachographDriversCardClientConfig,
        VehicleOperatorsClientConfig,
        VehiclePlateOrderingClientConfig,
        VehiclePlateRenewalClientConfig,
        ExemptionForTransportationClientConfig,
        TaxiClientConfig,
        VehiclesClientConfig,
        VehiclesMileageClientConfig,
      ],
    }),
  ],
  providers: [
    MainResolver,
    TransportAuthorityApi,
    TaxiStationsResolver,
    TaxiDriversResolver,
  ],
  exports: [TransportAuthorityApi],
})
export class TransportAuthorityApiModule {}
