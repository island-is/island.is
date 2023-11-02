import { Module } from '@nestjs/common'
import {
  PublicVehiclesApiProvider,
  VehiclesApiProvider,
} from './vehiclesClient.service'
import { VehiclesApiPDFProvider } from './vehiclesClientPdf.service'

@Module({
  providers: [
    VehiclesApiProvider,
    PublicVehiclesApiProvider,
    VehiclesApiPDFProvider,
  ],
  exports: [
    VehiclesApiProvider,
    PublicVehiclesApiProvider,
    VehiclesApiPDFProvider,
  ],
})
export class VehiclesClientModule {}
