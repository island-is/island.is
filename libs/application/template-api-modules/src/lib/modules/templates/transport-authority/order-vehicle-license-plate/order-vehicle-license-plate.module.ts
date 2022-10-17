import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { OrderVehicleRegistrationCertificateService } from './order-vehicle-license-plate.service'

export class OrderVehicleRegistrationCertificateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OrderVehicleRegistrationCertificateModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [OrderVehicleRegistrationCertificateService],
      exports: [OrderVehicleRegistrationCertificateService],
    }
  }
}
