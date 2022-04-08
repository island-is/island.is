import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { GeneralFishingLicenseService } from './general-fishing-license.service'

export class GeneralFishingLicenseModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: GeneralFishingLicenseModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [GeneralFishingLicenseService],
      exports: [GeneralFishingLicenseService],
    }
  }
}
