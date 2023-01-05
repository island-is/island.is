import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { FileStorageModule } from '@island.is/file-storage'
import { EUROPEAN_HEALTH_INSURANCE_CARD_CONFIG } from './config/europeanHealthInsuranceCardConfig'
import { EuropeanHealthInsuranceCardService } from './european-health-insurance-card.service'

const tempValue = 'temp'

export class EuropeanHealthInsuranceCardModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EuropeanHealthInsuranceCardModule,
      imports: [SharedTemplateAPIModule.register(config), FileStorageModule],
      providers: [
        {
          provide: EUROPEAN_HEALTH_INSURANCE_CARD_CONFIG,
          useValue: {
            tempValue,
          },
        },
        EuropeanHealthInsuranceCardService,
      ],
      exports: [EuropeanHealthInsuranceCardService],
    }
  }
}
