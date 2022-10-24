import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { DigitalTachographDriversCardService } from './digital-tachograph-drivers-card.service'
import { DigitalTachographApiModule } from '@island.is/api/domains/transport-authority/digital-tachograph'

export class DigitalTachographDriversCardModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: DigitalTachographDriversCardModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DigitalTachographApiModule,
      ],
      providers: [DigitalTachographDriversCardService],
      exports: [DigitalTachographDriversCardService],
    }
  }
}
