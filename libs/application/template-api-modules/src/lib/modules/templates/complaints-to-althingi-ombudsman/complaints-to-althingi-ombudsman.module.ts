import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { FileStorageModule } from '@island.is/file-storage'
import { ComplaintsToAlthingiOmbudsmanService } from './complaints-to-althingi-ombudsman.service'

export class ComplaintsToAlthingiOmbudsmanModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ComplaintsToAlthingiOmbudsmanModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FileStorageModule.register({}),
      ],
      providers: [ComplaintsToAlthingiOmbudsmanService],
      exports: [ComplaintsToAlthingiOmbudsmanService],
    }
  }
}
