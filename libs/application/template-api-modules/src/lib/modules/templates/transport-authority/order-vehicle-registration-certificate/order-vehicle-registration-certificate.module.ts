import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { OrderVehicleRegistrationCertificateService } from './order-vehicle-registration-certificate.service'
import {
  VehiclePrintingClientModule,
  VehiclePrintingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-printing'

@Module({
  imports: [
    SharedTemplateAPIModule,
    VehiclePrintingClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [VehiclePrintingClientConfig],
    }),
  ],
  providers: [OrderVehicleRegistrationCertificateService],
  exports: [OrderVehicleRegistrationCertificateService],
})
export class OrderVehicleRegistrationCertificateModule {}
