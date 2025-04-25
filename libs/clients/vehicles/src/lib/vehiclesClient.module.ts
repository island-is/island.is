import { Module } from '@nestjs/common'
import { VehiclesApiPDFProvider } from './vehiclesClientPdf.service'
import { VehiclesApiProvider, PublicVehiclesApiProvider } from './providers'
import { VehiclesClientService } from './vehiclesClient.service'

@Module({
  providers: [
    VehiclesApiProvider,
    PublicVehiclesApiProvider,
    VehiclesApiPDFProvider,
    VehiclesClientService,
  ],
  exports: [
    VehiclesApiProvider,
    PublicVehiclesApiProvider,
    VehiclesApiPDFProvider,
    VehiclesClientService,
  ],
})
export class VehiclesClientModule {}
