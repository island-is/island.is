import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleLicensePlateService } from './order-vehicle-registration-certificate.service'
import { OrderVehicleRegistrationCertificateApiModule } from '@island.is/api/domains/transport-authority/order-vehicle-registration-certificate'

export class OrderVehicleLicensePlateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleLicensePlateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        OrderVehicleRegistrationCertificateApiModule,
      ],
      providers: [OrderVehicleLicensePlateService],
      exports: [OrderVehicleLicensePlateService],
    }
  }
}
