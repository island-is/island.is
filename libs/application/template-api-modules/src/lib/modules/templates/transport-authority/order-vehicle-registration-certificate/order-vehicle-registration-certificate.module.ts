import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleRegistrationCertificateService } from './order-vehicle-registration-certificate.service'
import {
  VehiclePrintingClientModule,
  VehiclePrintingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-printing'

export class OrderVehicleLicensePlateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleLicensePlateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehiclePrintingClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehiclePrintingClientConfig],
        }),
      ],
      providers: [OrderVehicleRegistrationCertificateService],
      exports: [OrderVehicleRegistrationCertificateService],
    }
  }
}
