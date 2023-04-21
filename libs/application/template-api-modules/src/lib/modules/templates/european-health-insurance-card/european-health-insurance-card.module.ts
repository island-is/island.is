import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { EuropeanHealthInsuranceCardService } from './european-health-insurance-card.service'

const tempValue = 'temp'

export class EuropeanHealthInsuranceCardModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EuropeanHealthInsuranceCardModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [EuropeanHealthInsuranceCardService],
      exports: [EuropeanHealthInsuranceCardService],
    }
  }
}
