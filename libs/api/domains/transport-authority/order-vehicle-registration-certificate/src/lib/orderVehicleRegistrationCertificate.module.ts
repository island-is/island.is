import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  VehiclePrintingClientModule,
  VehiclePrintingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-printing'
import { MainResolver } from './graphql/main.resolver'
import { OrderVehicleRegistrationCertificateApi } from './orderVehicleRegistrationCertificate.service'

@Module({
  imports: [
    VehiclePrintingClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclePrintingClientConfig],
    }),
  ],
  providers: [MainResolver, OrderVehicleRegistrationCertificateApi],
  exports: [OrderVehicleRegistrationCertificateApi],
})
export class OrderVehicleRegistrationCertificateApiModule {}
