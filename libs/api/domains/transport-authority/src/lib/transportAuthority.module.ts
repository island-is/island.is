import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MainResolver } from './graphql/main.resolver'
import { TransportAuthorityApi } from './transportAuthority.service'
import {
  VehicleCodetablesClientModule,
  VehicleCodetablesClientConfig,
} from '@island.is/clients/transport-authority/vehicle-codetables'
import {
  VehicleInfolocksClientModule,
  VehicleInfolocksClientConfig,
} from '@island.is/clients/transport-authority/vehicle-infolocks'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import {
  VehiclePlateOrderingClientModule,
  VehiclePlateOrderingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'

@Module({
  imports: [
    VehicleCodetablesClientModule,
    VehicleInfolocksClientModule,
    DigitalTachographDriversCardClientModule,
    DrivingLicenseApiModule,
    VehiclePlateOrderingClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        VehicleCodetablesClientConfig,
        VehicleInfolocksClientConfig,
        DigitalTachographDriversCardClientConfig,
        VehiclePlateOrderingClientConfig,
      ],
    }),
  ],
  providers: [MainResolver, TransportAuthorityApi],
  exports: [TransportAuthorityApi],
})
export class TransportAuthorityApiModule {}
