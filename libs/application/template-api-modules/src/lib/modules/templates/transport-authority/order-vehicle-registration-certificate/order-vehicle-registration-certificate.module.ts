import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleRegistrationCertificateService } from './order-vehicle-registration-certificate.service'
import {
  VehiclePrintingClientModule,
  VehiclePrintingClientConfig,
} from '@island.is/clients/transport-authority/vehicle-printing'
import {
  VehiclesClientModule,
  VehiclesClientConfig,
} from '@island.is/clients/vehicles'
import { AuthModule } from '@island.is/auth-nest-tools'

export class OrderVehicleRegistrationCertificateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleRegistrationCertificateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        VehiclePrintingClientModule,
        VehiclesClientModule,
        AuthModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [VehiclePrintingClientConfig, VehiclesClientConfig],
        }),
      ],
      providers: [OrderVehicleRegistrationCertificateService],
      exports: [OrderVehicleRegistrationCertificateService],
    }
  }
}
