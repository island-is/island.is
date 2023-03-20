import { Module } from '@nestjs/common'
import { VehiclesApiProvider } from './vehiclesClient.service'
import { VehiclesApiPDFProvider } from './vehiclesClientPdf.service'

@Module({
  providers: [VehiclesApiProvider, VehiclesApiPDFProvider],
  exports: [VehiclesApiProvider, VehiclesApiPDFProvider],
})
export class VehiclesClientModule {}
