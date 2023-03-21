import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { EuropeanHealthInsuranceCardService } from './european-health-insurance-card.service'
import { EhicClientModule } from '@island.is/clients/ehic-client-v1'

export class EuropeanHealthInsuranceCardModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EuropeanHealthInsuranceCardModule,
      imports: [EhicClientModule, SharedTemplateAPIModule.register(config)],
      providers: [EuropeanHealthInsuranceCardService],
      exports: [EuropeanHealthInsuranceCardService],
    }
  }
}
