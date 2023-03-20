import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { DigitalTachographWorkshopCardService } from './digital-tachograph-workshop-card.service'

export class DigitalTachographWorkshopCardModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DigitalTachographWorkshopCardModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [DigitalTachographWorkshopCardService],
      exports: [DigitalTachographWorkshopCardService],
    }
  }
}
