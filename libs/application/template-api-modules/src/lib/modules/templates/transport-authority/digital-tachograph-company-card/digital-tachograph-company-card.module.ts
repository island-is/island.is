import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { DigitalTachographCompanyCardService } from './digital-tachograph-company-card.service'

export class DigitalTachographCompanyCardModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DigitalTachographCompanyCardModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [DigitalTachographCompanyCardService],
      exports: [DigitalTachographCompanyCardService],
    }
  }
}
