import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { DigitalTachographDriversCardService } from './digital-tachograph-drivers-card.service'

export class DigitalTachographDriversCardModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DigitalTachographDriversCardModule,
      imports: [SharedTemplateAPIModule.register(baseConfig)],
      providers: [DigitalTachographDriversCardService],
      exports: [DigitalTachographDriversCardService],
    }
  }
}
